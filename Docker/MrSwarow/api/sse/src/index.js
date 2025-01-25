const port = process.env.APPPORT || 6000;
const path = process.env.APPPATH || "/sse";
const { APP } = require('../app')
const { Jwt } = require('../jwt')
const { Express } = require('../express')
const { Redis } = require('../redis')

Express.configApp();

Redis.config()
Redis.client.on('ready', e => { 
    Redis.client.psubscribe(`${Redis.channels.products}:*`)
    Redis.client.psubscribe(`${Redis.channels.sales}:*`)
    Redis.client.psubscribe(`${Redis.channels.clients}:*`)
    Redis.client.psubscribe(`${Redis.channels.payment_methods}:*`)
})

Express.app.get(path, (req, res) => {

    Jwt.verifySession(req.cookies.JWT)
    .then(token => {

        res.writeHead(APP.statusCode.ok, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        })
//,'X-Accel-Buffering': 'no'
        res.write('\n');
        Redis.client.on('pmessage', (pattern, channel, message) => {
            console.log(`La entidad es : ${token.entity}, el patrón es : ${channel.split(":")[1]}, el canal es ${channel} y el mensaje es ${message}`)
            
            if(token.entity === channel.split(":")[1]) res.write(`event: update\ndata: ${message}\nid: ${Date.now()}\n\n`)
            
        })

        req.on('close', () => {});
    })
    .catch(e =>  res.writeHead(APP.statusCode.unauthorized).end())
})

Express.app.listen(port, () => console.log(`Microservicio de ${path} está funcionando en el puerto ${port}`))