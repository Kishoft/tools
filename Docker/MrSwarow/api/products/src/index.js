const port =  process.env.APPPORT || 6002;
const path = process.env.APPPATH || '/products';
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

    const dbcol = connection.db(Mongo.database).collection(Mongo.collections.products)
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
            let producto = {};
            producto.entidad = Mongo.objectID(token.entity);
            producto.deleted = false;
            producto.fecha_modificacion = Mongo.date();
            producto.codigo = String(req.body.codigo);
            producto.nombre = String(req.body.nombre);
            producto.marca = String(req.body.marca);
            if(req.body.categoria) producto.categoria = String(req.body.categoria);
            if(req.body.proveedores){
                producto.proveedores = [];
                req.body.proveedores.forEach(proveedor => {
                    producto.proveedores.push(Mongo.objectID(proveedor))
                })
            }
            if(req.body.precio.valor) producto.precio.valor = Mongo.double(req.body.precio.valor) || Mongo.double(0)
            if(req.body.precio.divisa) producto.precio.divisa = String(req.body.precio.divisa) || "S/E"
            if(req.body.fecha_vencimiento_minima) producto.fecha_vencimiento_minima = Date(req.body.fecha_vencimiento_minima) 
            
            dbcol
            .insertOne(producto)
            .then(dbr => { 
                if(dbr.result.ok === 1){
                    Redis.client.publish(`${Redis.channels.products}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.products}))
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
            let producto = {};
            if(req.body.codigo) producto.codigo = String(req.body.codigo);
            if(req.body.nombre) producto.nombre = String(req.body.nombre);
            if(req.body.marca) producto.marca = String(req.body.marca);
            if(req.body.categoria) producto.categoria = String(req.body.categoria);
            if(req.body.precio.valor) producto.precio.valor = Mongo.double(req.body.precio.valor) || Mongo.double(0)
            if(req.body.precio.divisa) producto.precio.divisa = String(req.body.precio.divisa) || "S/E"
            dbcol
            .findOneAndUpdate(
            { 
                entidad : Mongo.objectID(token.entity),
                _id : Mongo.objectID(req.body.id)
            },
            {
                $set : producto,
                $currentDate : { fecha_modificacion : true }
            },
            { 
                returnOriginal : false 
            })
            .then(dbr => { 
                if(dbr.ok === 1){
                    Redis.client.publish(`${Redis.channels.products}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.products}))
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
                    Redis.client.publish(`${Redis.channels.products}:${token.entity}`, JSON.stringify({ path : path, collection : Mongo.collections.products}))
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