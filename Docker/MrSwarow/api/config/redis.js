class Redis {
    static channels = {
        products : "products",
        sales : "sales",
        clients : "clients",
        payment_methods : "payment_methods"
    }
    
    static redis = require('redis');
    static client = this.redis.createClient({ host : 'redis' });
    static config(){
        this.client.on('connect', () => console.log(`Conectado a Redis`))
        this.client.on('error', e => console.log(`No se pudo conectar a Redis porque ${e}`))
    }
}

module.exports = { Redis }