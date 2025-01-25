class Router {
    static headers = { "Content-Type" : "application/json" }
    static get(path){
        return fetch(`https://api.swarow.com/${path}`,
            {
                credentials: 'include',
                method: 'GET',
                headers: this.headers   
            }
        )
    }
    static post(path, body){
        return fetch(`https://api.swarow.com/${path}`,
            {
                credentials: 'include',
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            }
        )
    }
    static put(path, body){
        return fetch(`https://api.swarow.com/${path}`,
            {
                credentials: 'include',
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(body)
            }
        )
    }
    static delete(path, body){
        if(body){
            return fetch(`https://api.swarow.com/${path}`,
                {
                    credentials: 'include',
                    method: 'DELETE',
                    headers: this.headers,
                    body: JSON.stringify(body)
                }
            )
        }
        else{
            return fetch(`https://api.swarow.com/${path}`,
                {
                    credentials: 'include',
                    method: 'DELETE',
                    headers: this.headers
                }
            )
        }
    }
    static loadComponentAsync(path, name){
        return window.customElements.get(name) ? Promise.resolve() : import(path) 
    }
    static activateComponent(fileName, tagName){
        
        Router.loadComponentAsync(`./components/${fileName}`, tagName)
        .then(() => { document.getElementById('app').innerHTML = `<${tagName}></${tagName}` })
        .catch(e => console.log(e))
        
    }
    static placeComponent(HTMLTag){
        document.getElementById('app').innerHTML = HTMLTag
    }
    static signin(){ this.placeComponent('<signin-form></signin-form>') }
    static signup(){ this.placeComponent('<signup-form></signup-form>') }
    static signout(){ 
        //Limpia los datos
        localStorage.removeItem('name');
        localStorage.removeItem('surname');
        localStorage.removeItem('entity');
        //ELimina la cookie
        navigator.serviceWorker.ready.then(reg => reg.sync.register(Router.delete('signin')));
        //Desactiva el SSE si es que estaba activo
        navigator.serviceWorker.ready.then(r => r.active.postMessage('signout'));
        //Muestra la pantalla de inicio de sesión
        this.signin()
    }

    static entitySelector(){ this.placeComponent('<entity-selector></entity-selector>') }
    static products(){ this.placeComponent(`<list-products></list-products>`)}
    static sales(){ this.placeComponent('<list-sales></list-sales>') }
    static clients(){ this.placeComponent('<list-clients></list-clients>') }
    static payment_methods(){ this.placeComponent('<list-payment_methods></list-payment_methods>') }
}