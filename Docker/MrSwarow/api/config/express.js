class Express {
    static express = require("express");
    static app = Express.express();
    static cookieParser = require("cookie-parser");
    static cors = require("cors");
    //Métodos
    static configApp(){
        this.app.use(this.express.json());
        this.app.use(this.express.urlencoded({ extended : false }));
        this.app.use(this.cors({ origin : ["https://app.swarow.com", "app.swarow.com"], credentials : true, allowedHeaders : "Content-Type" }));
        this.app.use(this.cookieParser());
        this.app.all((req, res, next) => {
            console.log(req.headers)
            next()
        })
    }
}

module.exports = { Express }