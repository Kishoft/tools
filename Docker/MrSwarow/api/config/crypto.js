class Crypto {
    static crypto = require('crypto')
    static generateHash(arg){
        return this.crypto.createHash('sha256').update(arg).digest("hex")
    }
}

module.exports = { Crypto }