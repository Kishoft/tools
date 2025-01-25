const port =  process.env.APPPORT || 6004;
const path = process.env.APPPATH || '/payment_methods';
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

    const dbcol = connection.db(Mongo.database).collection(Mongo.collections.payment_methods)
    //GET
    Express.app.get(path,(req, res) => {
        Jwt.verifySession(req.cookies.JWT)
        .then(token => {
            dbcol
            .find({ entidad : Mongo.objectID(token.entity), /*fecha_modificacion : { $gte : new Date(req.cookies[token.entity]) } */})
            .toArray()
            .then(dbr => {
                res
                .status(APP.statusCode.ok)
                .cookie(token.entity, Mongo.date(), { domain : '.swarow.com', secure: true, httpOnly : true, sameSite : 'Strict' , path : path })
                .json(dbr)
            })
            
        console.log(req.cookies[token.entity])
        })
        .catch(e => res.status(e).end())
    })
    //POST
    Express.app.post(path,(req, res) => {
        Jwt.verifySession(req.cookies.JWT)
        .then(token => {

            let payment_method = {};
            payment_method.entidad = Mongo.objectID(token.entity);
            payment_method.deleted = false;
            payment_method.fecha_modificacion = Mongo.date();
            payment_method.nombre = String(req.body.nombre);
            payment_method.cuotas = [];
            req.body.cuotas.forEach(c => {
                payment_method.cuotas.push({
                    cantidad : Number(c.cantidad),
                    recargo : Number(c.recargo)
                })
            })

            dbcol
            .insertOne(payment_method)
            .then(dbr => { 
                if(dbr.result.ok === 1){
                    Redis.client.publish(`${Redis.channels.payment_methods}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.payment_methods}))
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

            let payment_method = {};
            if(req.body.nombre) payment_method.nombre = String(req.body.nombre);
            if(req.body.cuotas) { 
                payment_method.cuotas = Array(req.body.cuotas)
                payment_method.cuotas.forEach(c => {
                    payment_method.cuotas.push({
                        cantidad : Number(c.cantidad),
                        recargo : Number(c.recargo)
                    })
                })
            };
            
            dbcol
            .findOneAndUpdate(
            { 
                entidad : Mongo.objectID(token.entity),
                _id : Mongo.objectID(req.body.id)
            },
            {
                $set : payment_method,
                $currentDate : { fecha_modificacion : true }
            },
            { 
                returnOriginal : false 
            })
            .then(dbr => { 
                if(dbr.ok === 1){
                    Redis.client.publish(`${Redis.channels.payment_methods}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.payment_methods}))
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
            .findOneAndUpdate(
            { 
                entidad : Mongo.objectID(token.entity),
                _id : Mongo.objectID(req.body.id)
            },
            {
                $set : { deleted : true },
                $currentDate : { fecha_modificacion : true }
            },
            { 
                returnOriginal : false 
            })
            .then(dbr => {
                if(dbr.ok === 1){
                    Redis.client.publish(`${Redis.channels.payment_methods}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.payment_methods}))
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