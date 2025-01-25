//Cada db corresponde a una franquicia
//La coleccion de productos es la de mayor jerarquía porque posee todos los datos de stock
//2- los usuarios tendran un codigo de cuenta para compartir (supongo que QR o algo así) para sync
//3- microservicio de sync tendrá en vista los stocks de otros usuarios para solicitar pedidos de mercaderia con un precio 
//el microservicio sync verificará que el usuario que pida la lista tenga privilegios para verla y cuál es la que puede ver
//tambien podra emitir una lista publica luego le enviará una lista con la mercadería y código
//también aceptará una petición post para inyectar un pedido en la base de datos del vendedor y así reservar stock
//SSE-Envía información apenas se conecta el cliente de los últimos updates para que sepa si tiene todo actualizado
//Al hacer la comparación, si no concuerda entonces enviará los productos - evaluar una estructura escalable para este fin
//-preguntarle a marcelo lo de stock invertido (causa)

const { Mongo } = require('./database.js')

const usuariosConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["usuario", "contrasena"],
            properties: {
                usuario: { bsonType: "string" },
                contrasena: { bsonType: "string" },
                datos_personales: {
                    bsonType: "object",
                    properties: {
                        nombre: { bsonType: "string" },
                        apellido: { bsonType: "string" },
                        dni: { bsonType: "string" },
                        domicilio: { bsonType: "array" },
                        email: { bsonType: "array" },
                        telefono: { bsonType: "array" }
                    }
                }
            }
        }
    }
}//Listo - solo backend
const contratosConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "usuario"],
            properties: {
                entidad: { bsonType: "objectId" },//Hacerlo índice pero no usarlo como shard ind
                usuario: { bsonType: "objectId" },//Hacerlo indice pero no usarlo como shard ind
                privilegios: { bsonType: "int" },//0 para dueño, 1 para jefe, 2 personal contable, etc
                temporal: { bsonType: "date" },//Si tiene fecha es temporal, sino permanente
                horarios: { bsonType: "object" },
                expira: { bsonType: "date" },
                aprobado: { bsonType: "bool" },//los que no están aprobados y están expirados, se eliminarán
                detalles: { bsonType: "string" }//Puede ser un mensaje, descripción del rol, condiciones, etc
            }
        }
    }
}//Los contratos NO podrán ser modificados, solo aprobados, desaprobados (PUT) o eliminados (DELETE)
const entidadesConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["razon_social"],
            properties: {
                razon_social: { bsonType: "string" },
                fecha_modificacion: { bsonType: "date" },
                logo: { bsonType: "string" },
                pago_hasta: { bsonType: "date" }
            }
        }
    }
}//Listo - backend y frontend, serán aprobadas por un administrador porque es el que asigna SERVIDOR
const lugaresConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "nombre"],
            properties: {
                entidad: { bsonType: "objectId" },
                fecha_modificacion: { bsonType: "date" },
                nombre: { bsonType: "string" },
                ubicacion: {
                    bsonType: "object",
                    properties: {
                        coordenadas: { bsonType: "object" },
                        pais: { bsonType: "string" },
                        estado: { bsonType: "string" },
                        localidad: { bsonType: "string" },
                        direccion: { bsonType: "string" },
                        piso: { bsonType: "string" },
                        departamento: { bsonType: "string" },
                        cp: { bsonType: "string" }
                    }
                },
                contacto: {
                    bsonType: "object",
                    properties: {
                        telefonos: { bsonType: "array" },
                        emails: { bsonType: "array" }
                    }
                }
            }
        }
    }
}//Listo - podrán ser creadas y administradas por un usuario jefe, un administrador puede llamar la atención si hay muchos
const sectoresConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "nombre"],
            properties: {
                entidad: { bsonType: "objectId" },
                fecha_modificacion: { bsonType: "date" },
                codigo: { bsonType: "string" },
                nombre: { bsonType: "string" },
                tipo: { bsonType: "int" },//Punto de venta,deposito o sección de un deposito, esto sirve para filtrar 
                description: { bsonType: "string" },
                lugar: { bsonType: "objectId" }
            }
        }
    }
}//Listo - lo mismo que lugares
const historialConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "usuario", "operacion", "fecha"],
            properties: {
                entidad: { bsonType: "objectId" },
                usuario: { bsonType: "objectId" },
                operacion: { bsonType: "int" },
                fecha: { bsonType: "date" },
                detalles: { bsonType: "array" }//Todavía no sé qué detalles voy a poner
            }
        }
    }
}//Listo en gran parte - el frontend solo lo podrá ver, el backend lo modifica - Ingresos, egresos, productos removidos por rotura, vencimiento, regalos - hablar con el admin acerca del lapso de borrado
const productosConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "nombre", "precio", "deleted"],
            properties: {
                entidad: { bsonType: "objectId" },
                deleted: { bsonType: "bool" },
                fecha_modificacion: { bsonType: "date" },
                codigo: { bsonType: "string" }, //generalmente es el código de barras, sirve para el front end nomas o quizá en algún momento para un sistema de auto stock
                nombre: { bsonType: "string" },
                marca: { bsonType: "string" },
                categoria: { bsonType: "string" }, //hacerlas en el frontend
                proveedores: {
                    bsonType: "array",
                    properties: {
                        proveedor: { bsonType: "objectId" }
                    }
                },//Mostrar solo a responsables de compra
                precio: {
                    bsonType: "object",
                    properties: {
                        valor: { bsonType : "double" },
                        divisa: { bsonType : "string" }
                    }
                },
                moneda: { bsonType: "string" },//Mostrar a cualquiera
                stock: {
                    bsonType: "array",
                    required: ["cantidad"],
                    properties: {
                        sector: { bsonType: "objectId" },
                        cantidad: { bsonType: "int" }
                    }
                },//Implementar punto de venta en el contrato (con la base areas), así cuando se vende, que advierta al operador si tendrá que hacer una solicitud de stock a otro lado
                fecha_vencimiento_minima: { bsonType: "date" }
            }//Los productos no podrán ser modificados por los depositarios, solo se utilizará el modulo de deposito para agregar o sacar productos
        }
    }
}//Listo
const clientesConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "deleted"],
            properties: {
                entidad: { bsonType: "objectId" },
                deleted: { bsonType: "bool" },
                fecha_modificacion: { bsonType: "date" },
                fecha_alta: { bsonType: "date" },
                token: { bsonType: "string" }, //dato que va a utilizar el cliente para comprobar que es él en el sistema y poder hacer pedidos
                nombre: { bsonType: "string" },
                apellido: { bsonType: "string" },
                razon_social: { bsonType: "string" },
                identificacion: { bsonType: "string" }
            }
        }
    }
}//Listo
//el usuario podrá crear una contraseña para su cliente así puede visualizar stock en TR y hacer pedidos
//el cliente podrá hacer un pedido y el usuario lo aprobará o rechazará o aceptará automáticamente una vez haya sido pago,
// esta api es para que te puedan reservar un pedido o hacer una compra
//para eso el usuario generará un permiso de bajo nivel para que vea su stock y solo pueda realizar pedidos
//el pedido una vez aprobado, y cobrado, directamente se auto venta apareciendo en terminadas
const proveedoresConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "nombre"],
            properties: {
                entidad: { bsonType: "objectId" },
                fecha_modificacion: { bsonType: "date" },
                nombre: { bsonType: "string" },
                identificacion: { bsonType: "string" },
                ubicacion: {
                    bsonType: "object",
                    properties: {
                        pais: { bsonType: "string" },
                        estado: { bsonType: "string" },
                        localidad: { bsonType: "string" },
                        direccion: { bsonType: "string" },
                        piso: { bsonType: "string" },
                        departamento: { bsonType: "string" },
                        cp: { bsonType: "string" }
                    }
                },
                contacto: {
                    bsonType: "object",
                    properties: {
                        stockSync: { bsonType: "bool" },
                        telefonos: { bsonType: "array" },
                        emails: { bsonType: "array" }
                    }
                }
            }
        }
    }
}//Listo - se modifican desde el frontend
const mediosDePagoConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "nombre"],
            properties: {
                entidad: { bsonType: "objectId" },
                fecha_modificacion: { bsonType: "date" },
                nombre: { bsonType: "string" },
                cuotas: {
                    bsonType: "array",
                    properties: {
                        cantidad: { bsonType: "int" },
                        recargo: {
                            minimum: 0,
                            maximum: 999999999999999
                        }
                    }
                }
            }
        }
    }
}//Listo - gestionado por el frontend y cliente; no es más que un almacen
const ventasConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "deleted", "tipo", "fecha_emision"],
            properties: {
                entidad: { bsonType: "objectId" },
                deleted: { bsonType: "bool" },
                fecha_modificacion: { bsonType: "date" },
                esPedido: { bsonType: "bool" }, //si es false, entonces se trata de una venta común, si es true se va a mostrar en sección pedidos para aprobación
                cliente: { bsonType: "objectId" },
                tipo: { bsonType: "string" },
                fecha_emision: { bsonType: "date" },
                detalles: {
                    bsonType: "array",
                    properties: {
                        producto: { bsonType: "objectId" },
                        cantidad: {
                            minimum: 0,
                            maximum: 999999999999999
                        },
                        lista: { bsonType: "objectId" },
                        sector: { bsonType: "objectId" }
                    }
                },
                medio_de_pago: {
                    bsonType: "object",
                    properties: {
                        nombre: { bsonType: "objectId" },
                        cuotas: { bsonType: "int" }
                    }
                }
            }
        }
    }
}//Listo - cuando una venta no dice de dónde se sacó el objeto, entonces es un pedido que hay que completar
const facturasConf =
{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["entidad", "tipo", "fecha", "liquidada", "detalles"],
            properties: {
                entidad: { bsonType: "objectId" },
                tipo: { bsonType: "string" },
                cliente: { bsonType: "objectId" },
                fecha: { bsonType: "date" },
                liquidada: { bsonType: "bool" },
                detalles: {
                    bsonType: "array",
                    properties: {
                        producto: { bsonType: "string" },
                        marca: { bsonType: "string" },
                        cantidad: {
                            minimum: 0,
                            maximum: 999999999999999
                        },
                        precio: {
                            minimum: 0,
                            maximum: 999999999999999
                        }
                    }
                },
                medio_de_pago: {
                    bsonType: "object",
                    properties: {
                        nombre: { bsonType: "string" },
                        cuotas: {
                            bsonType: "array",
                            properties: {
                                cantidad: { bsonType: "int" },
                                recargo: {
                                    minimum: 0,
                                    maximum: 999999999999999
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}//Listo - no pueden ser modificadas

Mongo.client
    .connect()
    .then(async connection => {

        if (connection) console.log('Hay conexión')

        //Crear la colección
        try {
            
            console.log('Creando colecciones')

            await Promise.all([
                connection.db(Mongo.database).createCollection(Mongo.collections.users, usuariosConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.contracts, contratosConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.entities, entidadesConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.history, historialConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.products, productosConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.clients, clientesConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.providers, proveedoresConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.places, lugaresConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.sectors, sectoresConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.payment_methods, mediosDePagoConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.sales, ventasConf),
                connection.db(Mongo.database).createCollection(Mongo.collections.invoices, facturasConf)
            ])

            console.log('Colecciones creadas');
            console.log('Activando particionado en la base de datos')

            await Promise.all([
                connection.db(Mongo.database).admin().command({ enableSharding: Mongo.database })
            ])

            console.log("Base de datos particionada")
            console.log('Particionando las colecciones y agregando índices');

            await Promise.all([
                //connection.db(Mongo.database).admin().command({ shardCollection : `${Mongo.database}.${Mongo.collections.users}`, key : { usuario : 1 }, unique : true }),
                //connection.db(Mongo.database).admin().command({ shardCollection : `${Mongo.database}.${Mongo.collections.contracts}`, key : { entidad : 1, usuario : 1, _id : 1 } }),
                //connection.db(Mongo.database).admin().command({ shardCollection : `${Mongo.database}.${Mongo.collections.entities}`, key : { _id : 1 } }),
                connection.db(Mongo.database).admin().command({ shardCollection: `${Mongo.database}.${Mongo.collections.history}`, key: { entidad: 1, _id: 1 } }),
                connection.db(Mongo.database).admin().command({ shardCollection: `${Mongo.database}.${Mongo.collections.products}`, key: { entidad: 1, _id: 1 } }),
                connection.db(Mongo.database).admin().command({ shardCollection: `${Mongo.database}.${Mongo.collections.clients}`, key: { entidad: 1, _id: 1 } }),
                connection.db(Mongo.database).admin().command({ shardCollection: `${Mongo.database}.${Mongo.collections.providers}`, key: { entidad: 1, _id: 1 } }),
                connection.db(Mongo.database).admin().command({ shardCollection: `${Mongo.database}.${Mongo.collections.places}`, key: { entidad: 1, _id: 1 } }),
                connection.db(Mongo.database).admin().command({ shardCollection: `${Mongo.database}.${Mongo.collections.sectors}`, key: { entidad: 1, _id: 1 } }),
                connection.db(Mongo.database).admin().command({ shardCollection: `${Mongo.database}.${Mongo.collections.payment_methods}`, key: { entidad: 1, _id: 1 } }),
                connection.db(Mongo.database).admin().command({ shardCollection: `${Mongo.database}.${Mongo.collections.sales}`, key: { entidad: 1, _id: 1 } }),
                connection.db(Mongo.database).admin().command({ shardCollection: `${Mongo.database}.${Mongo.collections.invoices}`, key: { entidad: 1, _id: 1 } })
            ])

            console.log('Configuración terminada');

            await connection.close()

            console.log('Conexión a la DB cerrada');

        }
        catch (error) {
            console.log(error)
            connection.close()
        }
    })
    .catch(error => console.log(error))