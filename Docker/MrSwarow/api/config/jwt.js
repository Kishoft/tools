
class Jwt {
    static jwt = require("jsonwebtoken");
    static secret = process.env.SECRET || "estoESunsecretolalalalalalalaLAAAa"
    static createSession(obj){
        return this.jwt.sign(obj, this.secret, { encoding : "UTF-8", algorithm : "HS512" } )
    }
    static verifySession(cookie){
        return new Promise((resolve, reject) => {
            if(cookie){ 
                this.jwt.verify(cookie, this.secret, (err, decoded) =>{
                    if(err) reject(406); console.log(err) //Hay algo sospechoso con el token
                    if(decoded) resolve(decoded) 
                })}
            else { reject(401) } //debe iniciar sesion
        })
        
    }
}

module.exports = { Jwt }