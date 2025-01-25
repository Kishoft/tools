class Mongo {
    static collections = {
        users: "usuarios",
        contracts: "contratos",
        entities: "entidades",
        history: "historial",
        products: "products",
        clients: "clients",
        providers: "proveedores",
        places: "lugares",
        sectors: "sectores",
        payment_methods: "payment_methods",
        price_lists: "listasDePrecios",
        sales: "sales",
        invoices: "facturas",
        last_update: "ultimoUpdateDeColeccion"
    }
    static mongo = require("mongodb");
    static database = "sisma";
    static authMechanism = "DEFAULT";
    static server = "192.168.88.20";
    static port = "27017";
    static user = "root";
    static password = "root";
    static uri = `mongodb://${this.server}:${this.port}/`
    static client = new this.mongo.MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });

    static timestamp(timeNumber) {
        return this.mongo.Timestamp.fromNumber(Number(timeNumber))
    }
    static decimal(decimalFromString) {
        return this.mongo.Decimal128.fromString(String(decimalFromString))
    }
    static objectID(objectIDFromString) {
        return this.mongo.ObjectID.createFromHexString(String(objectIDFromString))
    }
    static verifyID(objectID) {
        return new Promise((reject, resolve) => this.mongo.ObjectID.isValid(objectID) ? resolve(true) : reject(false))
    }
    static date() {
        return new Date(Date('es-AR'))
    }

}

module.exports = { Mongo }