const faker = require('faker');
faker.locale = "es_MX"
const { Mongo } = require('./database.js')
const { Crypto } = require('./crypto.js');
const { Double } = require('mongodb');

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

function hacerProductos(entidad, sector, cantidad){
    let prod = []
    for (let i = 0; i < cantidad; i++) {
        prod.push({
            entidad : Mongo.objectID(entidad),
            deleted : false,
            fecha_modificacion : Mongo.date(),
            nombre : faker.commerce.product(),
            marca : faker.commerce.productName(),
            categoria : faker.commerce.department(),
            precio : {
                valor: Double(faker.commerce.price(1, 90000, 2)),
                divisa : "ARS"
            },
            stock : [{ sector : Mongo.objectID(sector), cantidad : Number((Math.random()*1000).toFixed(0)) }]
        })
    }
    return prod
}

Mongo.client.connect().then( async connection => {

try {

    const usuario = await connection.db(Mongo.database).collection(Mongo.collections.users).insertOne({ usuario : "test", contrasena : Crypto.generateHash("test"), dni : "111111", loc : { type: "Point", coordinates: [ getRandomInRange(-80, 80, 6), getRandomInRange(-80, 80, 6)] }, datos_personales : { nombre : "Ezequiel", apellido : "administrador" } })
    const usuario2 = await connection.db(Mongo.database).collection(Mongo.collections.users).insertOne({ usuario : "test2", contrasena : Crypto.generateHash("test2"), dni : "111111", loc : { type: "Point", coordinates: [ getRandomInRange(-80, 80, 6), getRandomInRange(-80, 80, 6)] }, datos_personales : { nombre : "Fuckencio", apellido : "administrador" } })
    const usuario3 = await connection.db(Mongo.database).collection(Mongo.collections.users).insertOne({ usuario : "test3", contrasena : Crypto.generateHash("test3"), dni : "1111", loc : { type: "Point", coordinates: [ getRandomInRange(-80, 80, 6), getRandomInRange(-80, 80, 6)] }, datos_personales : { nombre : "Ortencio", apellido : "gonzalez" } })
    console.log('Usuarios creados')
    const entidad = await connection.db(Mongo.database).collection(Mongo.collections.entities).insertOne({ razon_social : "Chichito merca2", loc : { type: "Point", coordinates: [ getRandomInRange(-80, 180, 6), getRandomInRange(-80, 180, 6)] } })
    const entidad2 = await connection.db(Mongo.database).collection(Mongo.collections.entities).insertOne({ razon_social : "HUEHUEHUE", loc : { type: "Point", coordinates: [ getRandomInRange(-80, 80, 6), getRandomInRange(-80, 180, 6)] } })
    console.log('Entidades creadas')
    const contrato = await connection.db(Mongo.database).collection(Mongo.collections.contracts).insertOne({ usuario : Mongo.objectID(usuario.ops[0]._id), entidad: Mongo.objectID(entidad.ops[0]._id), privilegios : 1, aprobado : true })
    const contrato2 = await connection.db(Mongo.database).collection(Mongo.collections.contracts).insertOne({ usuario : Mongo.objectID(usuario2.ops[0]._id), entidad: Mongo.objectID(entidad2.ops[0]._id), privilegios : 1, aprobado : true })
    const contrato3 = await connection.db(Mongo.database).collection(Mongo.collections.contracts).insertOne({ usuario : Mongo.objectID(usuario3.ops[0]._id), entidad: Mongo.objectID(entidad.ops[0]._id), privilegios : 1, aprobado : true })
    console.log('Contratos creados')
    const lugar1 = await connection.db(Mongo.database).collection(Mongo.collections.places).insertOne({ entidad : Mongo.objectID(entidad.ops[0]._id), nombre : "Zona principal" })
    const lugar2 = await connection.db(Mongo.database).collection(Mongo.collections.places).insertOne({ entidad : Mongo.objectID(entidad.ops[0]._id), nombre : "Deposito 1" })
    console.log('Lugares creados')
    const sector1 = await connection.db(Mongo.database).collection(Mongo.collections.sectors).insertOne({ entidad : Mongo.objectID(entidad.ops[0]._id), nombre : "Góndola1", lugar : Mongo.objectID(lugar1.ops[0]._id) })
    const sector2 = await connection.db(Mongo.database).collection(Mongo.collections.sectors).insertOne({ entidad : Mongo.objectID(entidad.ops[0]._id), nombre : "Góndola2", lugar : Mongo.objectID(lugar1.ops[0]._id) })
    const sector3 = await connection.db(Mongo.database).collection(Mongo.collections.sectors).insertOne({ entidad : Mongo.objectID(entidad.ops[0]._id), nombre : "Sección 1", lugar : Mongo.objectID(lugar2.ops[0]._id) })
    const sector4 = await connection.db(Mongo.database).collection(Mongo.collections.sectors).insertOne({ entidad : Mongo.objectID(entidad.ops[0]._id), nombre : "Sección 2", lugar : Mongo.objectID(lugar2.ops[0]._id) })
    console.log('Sectores creados')
    const prod1 = await hacerProductos(entidad.ops[0]._id, sector1.ops[0]._id, 50)
    const prod2 = await hacerProductos(entidad.ops[0]._id, sector2.ops[0]._id, 50)
    const prod3 = await hacerProductos(entidad.ops[0]._id, sector3.ops[0]._id, 40)
    const prod4 = await hacerProductos(entidad.ops[0]._id, sector4.ops[0]._id, 60)
    console.log('Productos creados')
    
    await connection.db(Mongo.database).collection(Mongo.collections.products).insertMany(prod1)
    await connection.db(Mongo.database).collection(Mongo.collections.products).insertMany(prod2)
    await connection.db(Mongo.database).collection(Mongo.collections.products).insertMany(prod3)
    await connection.db(Mongo.database).collection(Mongo.collections.products).insertMany(prod4)
    console.log('Productos insertados')
    await connection.close()

} 
catch (error) {
    console.log(error)
    connection.close()
}

})