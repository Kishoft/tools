const port =  process.env.APPPORT || 6001;
const path = process.env.APPPATH || '/sales';
const { APP } = require('../app')
const { Jwt } = require('../jwt')
const { Express } = require('../express')
const { Mongo } = require('../mongo')
const { Redis } = require('../redis')

Express.configApp()

Redis.config()

Mongo.client.connect()
.then(connection => {

    if(connection) console.log('Conectado a Mongodb')

    const dbcol = connection.db(Mongo.database).collection(Mongo.collections.sales)
    //GET
    Express.app.get(path,(req, res) => {
        Jwt.verifySession(req.cookies.JWT)
        .then(token =>
            dbcol
            .find({ entidad : Mongo.objectID(token.entity) })
            .toArray()
            .then(sales => {
                res
                .status(APP.statusCode.ok)
                .cookie(token.entity, Date.now(), { domain : '.swarow.com', secure: true, httpOnly : true, sameSite : 'Strict' , path : path })
                .json(sales)
            }
            )
        )
        .catch(e => res.status(e).end())
    })
    //POST
    Express.app.post(path,(req, res) => {
        Jwt.verifySession(req.cookies.JWT)
        .then(token => {
            let sale = {};
            sale.entidad = Mongo.objectID(token.entity);
            sale.deleted = false;
            sale.fecha_modificacion = Mongo.date();
            sale.esPedido = Boolean(req.body.esPedido);
            sale.cliente = Mongo.objectID(req.body.cliente);
            sale.tipo = String(req.body.tipo);
            sale.fecha_emision = Mongo.date();
            if(req.body.detalles){
                sale.detalles = [];
                req.body.detalles.forEach(detalle => {
                    sale.detalles.push({ 
                        producto : Mongo.objectID(detalle.producto), 
                        cantidad : Number(detalle.cantidad), 
                        sector : Mongo.objectID(detalle.sector) 
                    })
                })
            }
            if(req.body.medio_de_pago){
                req.body.medio_de_pago.nombre = Mongo.objectID(sale.medio_de_pago.nombre)
                req.body.medio_de_pago.cuotas = Number(sale.medio_de_pago.cuotas)
            }

            dbcol
            .insertOne(sale)
            .then(dbr => { 
                if(dbr.result.ok === 1){
                    Redis.client.publish(`${Redis.channels.sales}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.products}))
                    res.status(APP.statusCode.ok).end()
                }                
            })
            .catch(() => res.status(APP.statusCode.internalServerError).end())
        })
        .catch(e => res.status(e).end())
    })
    //PUT
    Express.app.put(path,(req, res) => {
        if(!req.body.id){ res.status(APP.statusCode.notAcceptable).end();}
        Jwt.verifySession(req.cookies.JWT)
        .then(token => {

            let sale = {};
            if(sale.entidad) sale.entidad = Mongo.objectID(token.entity);
            if(sale.fecha_modificacion) sale.fecha_modificacion = Mongo.date();
            if(sale.esPedido) sale.esPedido = Boolean(req.body.esPedido);
            if(sale.cliente) sale.cliente = Mongo.objectID(req.body.cliente);
            if(sale.tipo) sale.tipo = String(req.body.tipo);
            if(req.body.detalles){
                sale.detalles = [];
                req.body.detalles.forEach(detalle => {
                    sale.detalles.push({ 
                        producto : Mongo.objectID(detalle.producto), 
                        cantidad : Number(detalle.cantidad), 
                        sector : Mongo.objectID(detalle.sector) 
                    })
                })
            }
            if(req.body.medio_de_pago){
                sale.medio_de_pago = {}
                if(req.body.medio_de_pago.nombre) req.body.medio_de_pago.nombre = Mongo.objectID(sale.medio_de_pago.nombre)
                if(req.body.medio_de_pago.cuotas) req.body.medio_de_pago.cuotas = Number(sale.medio_de_pago.cuotas)
            }

            dbcol
            .findOneAndUpdate({ 
                entidad : Mongo.objectID(token.entity),
                _id : Mongo.objectID(req.body.id)
            },
            {
                $set : sale,
                $currentDate : { fecha_modificacion : true }
            },
            { returnOriginal : false })
            .then(dbr => { 
                if(dbr.ok === 1){
                    Redis.client.publish(`${Redis.channels.sales}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.sales}))
                    res.status(APP.statusCode.ok).end()
                }
                else{
                    res.status(APP.statusCode.notAcceptable).end()
                }
            })
            .catch(() => res.status(APP.statusCode.internalServerError).end())         
        })
        .catch(e => res.status(e).end())
    })
    //DELETE
    Express.app.delete(path,(req, res) => {
        Jwt.verifySession(req.cookies.JWT)
        .then(token => {
            dbcol
            .findOneAndUpdate({ 
                entidad : Mongo.objectID(token.entity),
                _id : Mongo.objectID(req.body.id)
            },
            {
                $set : { deleted : true },
                $currentDate : { fecha_modificacion : true }
            },
            { returnOriginal : false })
            .then(dbr => {
                if(dbr.ok === 1){
                    Redis.client.publish(`${Redis.channels.sales}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.sales}))
                    res.status(APP.statusCode.ok).end()
                }
                else{ res.status(APP.statusCode.notAcceptable).end() }
            })
            .catch(() => res.status(APP.statusCode.internalServerError).end())
        })
        .catch(e => res.status(e).end())
    })
    
    Express.app.listen(port, () => console.log(`Microservicio de ${path} está funcionando en el puerto ${port}`));

})
.catch(e => {
    console.log(`No se pudo conectar a MongoDB porque ${e}`)
    process.exit(1);
});