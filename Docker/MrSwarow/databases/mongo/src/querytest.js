const { Mongo } = require('../../../api/config/mongo.js')
//Double soporta 13 enteros y 2 decimales sin volverse loco

Mongo.client
.connect()
.then(connection => {
    connection
    .db(`test`)
    .collection(`test`)
    .find({  })
    .toArray()
        .then(res => {
            res.forEach(r => {
                r.valor = Mongo.decimal(r.valor).toString()
            })
            console.log(res)
        })
    .then(()=>{ connection.close()})
})