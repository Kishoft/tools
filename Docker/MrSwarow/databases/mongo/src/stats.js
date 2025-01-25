const { Mongo } = require('../../../microservices/config/mongo.js')
/*
Mongo.client
.connect()
.then(connection => { 
    connection.db(Mongo.database).stats()
    .then(stats => console.log(stats))
    .then(() => connection.close()) 
})*/

Mongo.client.connect()
.then(connection => {
    connection.db('sisma').collection('products').aggregate([
        {

            $lookup : 
            {
                from: 'entidades',
                localField: 'entidad',
                foreignField: '_id',
                as: 'entidad'
            }
        }

    ])
    .toArray()
    .then(result => {
        console.log(result)
    })
    return connection
})
.then(connection =>{
    connection.db('sisma').collection('contratos').find({ usuario : Mongo.objectID('5e4ec533e38e3b0007a5e420') }).toArray().then(res => console.log(res)).then(()=>connection.close())
})