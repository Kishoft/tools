const port = process.env.APPPORT || 4001;
const path = process.env.APPPATH || "/signin";
const { APP } = require('../app')
const { Jwt } = require('../jwt')
const { Express } = require('../express')
const { Mongo } = require('../mongo')
const { Crypto } = require('../crypto')

Express.configApp();

Mongo.client.connect().then(connection => {
    
    if(connection) console.log('Conectado a Mongodb');

    const db = connection.db(Mongo.database);

    
    //Ingresa por primera vez con la cuenta
    Express.app.post(path, (req, res) => {

        if(!req.body.username && !req.body.password) { return res.status(APP.statusCode.badRequest).end() }

        db
        .collection(Mongo.collections.users)
        .findOne({ "usuario" : String(req.body.username), "contrasena" : Crypto.generateHash(String(req.body.password)) })
        .then(user => {
            return res
            .status(APP.statusCode.ok)
            .cookie("JWT", Jwt.createSession({ user : user._id }), { domain : '.swarow.com', secure: true, httpOnly : true, sameSite : 'Strict' , maxAge : 1200000 })
            .json({ name : user.datos_personales.nombre, surname : user.datos_personales.apellido })
            .end()
        })
        .catch(e => res.status(APP.statusCode.notFound).end()) //No se encuentra el usuario, en el front end solo decir "usuario o contraseña incorrectos, nunca aclarar qué"
        
    })
    //Adquiere la lista de contratos
    Express.app.get(path, (req, res) => {
        Jwt.verifySession(req.cookies.JWT)
        .then(token => {
            console.log(token)
            return db
            .collection(Mongo.collections.contracts)
            .aggregate([
                {
                    '$match': {
                      'usuario': Mongo.objectID(token.user)
                    }
                },
                {
                    '$lookup': {
                        'from': 'entidades', 
                        'localField': 'entidad', 
                        'foreignField': '_id', 
                        'as': 'entidad'
                    }
                }, 
                {
                    '$unwind': {
                        'path': '$entidad'
                    }
                },
                {
                    '$project': {
                        'usuario': 0
                    }
                }
            ])
            .toArray()
            
        })
        .then(cont => res.status(APP.statusCode.ok).json(cont))
        .catch(e => res.status(e).end())
    })
    //Loguea con un contrato ante una entidad
    Express.app.put(path, (req, res) => {
        console.log(req)
        if(!req.body.contrato){ res.status(APP.statusCode.unauthorized).end(); return }
        
        Jwt.verifySession(req.cookies.JWT)
        .then(token => {
            return db.collection(Mongo.collections.contracts)
            .findOne({ '_id': Mongo.objectID(req.body.contrato) })
            .then(result => {
                if ( result.usuario.toString() === token.user ) {
                    console.log(token.user)
                    return res
                    .status(APP.statusCode.ok)
                    .cookie("JWT", Jwt.createSession({ user : result.usuario, entity : result.entidad.toString(), autho : result.privilegios }), { domain : '.swarow.com', secure: true, httpOnly : true, sameSite : 'Strict' })
                    .json({ entity : result.entidad })
                    .end()
                }
                else {
                    return res
                    .status(APP.statusCode.unauthorized)
                    .clearCookie("JWT", { domain : '.swarow.com', secure: true, httpOnly : true, sameSite : 'Strict' })
                    .end()
                }
            })
        })
        .catch(e => res.status(e).clearCookie("JWT", { domain : '.swarow.com', secure: true, httpOnly : true, sameSite : 'Strict' }).end())//Token corrupto
    })

    Express.app.delete(path, (req, res) => {
        return res
        .status(APP.statusCode.ok)
        .clearCookie("JWT", { domain : '.swarow.com', secure: true, httpOnly : true, sameSite : 'Strict' })
        .end()
    })

    Express.app.listen(port, () => console.log(`Microservicio de ${path} está funcionando en el puerto ${port}`));

})
.catch(e => {
    console.log(`No se pudo conectar a MongoDB porque ${e}`)
    process.exit(1);
});