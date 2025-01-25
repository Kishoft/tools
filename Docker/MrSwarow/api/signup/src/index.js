const port = process.env.APPPORT || 4000;
const path = process.env.APPPATH || "/signup";
const { APP } = require('../app')
const { Express } = require('../express')
const { Mongo } = require('../mongo')

Express.configApp();

Mongo.client.connect().then(connection => {

    if(connection) console.log('Conectado a Mongodb')
    
    const dbcol = connection.db(Mongo.database).collection(Mongo.collections.users);

    Express.app.post(path, (req,res) => {
        if(!req.body.username || !req.body.password || !req.body.dni){
            res.status(APP.statusCode.notAcceptable).end();
            return;
        }
        dbcol
        .findOne({ usuario : String(req.body.username) })
        .then(usr => {
            if(usr){ res.status(APP.statusCode.conflict).end() }
            else{
                dbcol.insertOne({
                    "usuario" : String(req.body.username),
                    "contrasena" : Crypto.generateHash(String(req.body.password)),
                    "dni" : String(req.body.dni)
                })
                .then(() => res.status(APP.statusCode.created).end())
                .catch(() => res.status(APP.statusCode.internalServerError).end())
            }
        })
        .catch(() => res.status(APP.statusCode.internalServerError).end())
    })

    Express.app.listen(port, () => console.log(`Microservicio de ${path} está funcionando en el puerto ${port}`));
})
.catch(e => {
    console.log(`No se pudo conectar a MongoDB porque ${e}`)
    process.exit(1);
});