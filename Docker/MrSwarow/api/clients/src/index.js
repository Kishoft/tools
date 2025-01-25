const port =  process.env.APPPORT || 6003;
const path = process.env.APPPATH || '/clients';
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

    const dbcol = connection.db(Mongo.database).collection(Mongo.collections.clients)
    //GET
    Express.app.get(path,(req, res) => {
        Jwt.verifySession(req.cookies.JWT)
        .then(token => {
            dbcol
            .find({ entidad : Mongo.objectID(token.entity), fecha_modificacion : { $gte : new Date(req.cookies[token.entity]) } })
            .toArray()
            .then(dbr => {
                res
                .status(APP.statusCode.ok)
                .cookie(token.entity, Mongo.date(), { domain : '.swarow.com', secure: true, httpOnly : true, sameSite : 'Strict' , path : path })
                .json(dbr)
            })
        })
        .catch(e => res.status(e).end())
    })
    //POST
    Express.app.post(path,(req, res) => {
        Jwt.verifySession(req.cookies.JWT)
        .then(token => {

            let client = {};
            client.entidad = Mongo.objectID(token.entity);
            client.deleted = false;
            client.fecha_modificacion = Mongo.date();
            client.fecha_alta = Mongo.date();
            client.nombre = String(req.body.nombre);
            client.apellido = String(req.body.apellido);
            client.razon_social = String(req.body.razon_social);
            client.identificacion = String(req.body.identificacion);
            
            dbcol
            .insertOne(client)
            .then(dbr => { 
                if(dbr.result.ok === 1){
                    Redis.client.publish(`${Redis.channels.clients}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.clients}))
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

            let client = {};
            if(req.body.nombre) client.nombre = String(req.body.nombre);
            if(req.body.apellido) client.apellido = String(req.body.apellido);
            if(req.body.razon_social) client.razon_social = String(req.body.razon_social);
            if(req.body.identificacion) client.identificacion = String(req.body.identificacion);

            dbcol
            .findOneAndUpdate(
            { 
                entidad : Mongo.objectID(token.entity), 
                _id : Mongo.objectID(req.body.id)
            },
            { 
                $set : client,
                $currentDate : { fecha_modificacion : true } 
            },
            { 
                returnOriginal : false 
            })
            .then(dbr => { 
                if(dbr.ok === 1){
                    Redis.client.publish(`${Redis.channels.clients}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.clients}))
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
                    Redis.client.publish(`${Redis.channels.clients}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.clients}))
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