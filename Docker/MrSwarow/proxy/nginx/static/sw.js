/*
let cacheVersion = 'v10'

self.addEventListener('install', (event) => {
    console.log(`Me estoy instalando: ${event}`)
    event.waitUntil(
        caches.open(cacheVersion)
            .then((cache) => {
                return cache.addAll(
                    [
                        '/',
                        '/app.js',
                        '/router.js',
                        '/css/style.css',
                        '/components/navBar.js',
                        '/components/netStatus.js',
                        '/components/signin.js',
                        '/components/signup.js',
                        '/components/entitySelector.js'
                    ]
                );
            })
            .catch(e => console.log(e))
    );
});
this.addEventListener('fetch', function (event) {
    console.log(`Intercepto un fetch: ${event}`)
    event.respondWith(
        caches.match(event.request).then(function (resp) {
            return resp || fetch(event.request).then(function (response) {
                return caches.open(cacheVersion).then(function (cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});
this.addEventListener('activate', function (event) {

    console.log(`Me estoy activando: ${event}`)
    var cacheWhitelist = [cacheVersion];

    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
*/

class IDB {
    constructor(entity){
        this.version = 5;
        this.entity = entity;
        this.db;
        this.request = indexedDB.open(this.entity, this.version)

        this.request.onupgradeneeded = e => {
            let db = e.target.result;
            let productsObjStore = db.createObjectStore('products', { keyPath : "_id", autoIncrement : false })
            productsObjStore.createIndex("codigo", "codigo", { unique : false})
            productsObjStore.createIndex("nombre", "nombre", { unique : false})
            productsObjStore.createIndex("marca", "marca", { unique : false})
            productsObjStore.createIndex("categoria", "categoria", { unique : false})
            productsObjStore.createIndex("precio", "precio", { unique : false})
            db.createObjectStore('sales', { keyPath : "_id", autoIncrement : false })
            db.createObjectStore('clients', { keyPath : "_id", autoIncrement : false })
            db.createObjectStore('payment_methods', { keyPath : "_id", autoIncrement : false })
            
        }
        this.request.onerror = e => console.log(`Error al abrir la base de datos ${e}`);
        this.request.onsuccess = e => { this.db = this.request.result };
    }

    queryDispatcher(data, collection){
        return new Promise((resolve, reject) => {
            for (const key in data) {
                console.log(collection)
                console.log(data[key])
                if(data[key].deleted === false) {
                    this.db.transaction(collection, "readwrite").objectStore(collection).put(data[key])
                }
                else if (data[key].deleted === true) {
                    this.db.transaction(collection, "readwrite").objectStore(collection).delete(data[key]._id)
                }
            }
            resolve()
        })
    }

    updatedNotifier(collection){
        console.log('Se ha detectado una actualización')
        clients.matchAll().then(clients => clients.forEach(client => client.postMessage({ updated : collection })));
    }

    processData(data, collection){
        this.queryDispatcher(data, collection).then(() => this.updatedNotifier(collection))
    }

    refreshCollection(path, collection){
        fetch(`https://api.swarow.com${path}`,
        {
            credentials: 'include',
            method: 'GET',
            headers: { "Content-Type" : "application/json" }   
        })
        .then(res => res.json())
        .then(resjson => {
            database.processData(resjson, collection)
            console.log({ op : "fetch", obj : resjson})
        })
        .catch(e => console.log(`No se pudo refrescar la colección ${collection} porque ${e}`))
    }
}

class SSEengine {
    constructor(){
        this.SSE;
        this.activate();
    }
    config(){

        this.SSE.addEventListener('message', e => {
            console.log(e.data)
            self.registration.showNotification('Mensaje del creador', {
                body: e.data
            })
        })
        this.SSE.addEventListener('update', e => {
            let data = JSON.parse(e.data)
            console.log(data)
            database.refreshCollection(data.path, data.collection)
        })
        this.SSE.addEventListener('error', e => { 
            this.SSE.close()
            setTimeout(() => {
                this.activate()
            }, 5000)
        })
        this.SSE.addEventListener('open', e => {
            console.log(e)
        })
    }
    activate(){
            console.log('Iniciando SSE')
            this.SSE = new EventSource(`https://api.swarow.com/sse`, { withCredentials: 'include' });
            this.config();
    }
    close(){ this.SSE.close(); this.SSE = undefined }
}

let database = new IDB("test");
let SSE;


self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('sync', s => {
    if(s.tag === 'updateProducts'){ 
        console.log('Adquiriendo productos de la base de datos remota')
        s.waitUntil(database.refreshCollection('/products', 'products')) 
    }
    else if(s.tag === 'updateSales'){ 
        console.log('Adquiriendo ventas de la base de datos remota')
        s.waitUntil(database.refreshCollection('/sales', 'sales')) 
    }
    else if(s.tag === 'updateClients'){ 
        console.log('Adquiriendo clientes de la base de datos remota')
        s.waitUntil(database.refreshCollection('/clients', 'clients')) 
    }
    else if(s.tag === 'updatePaymentMethods'){ 
        console.log('Adquiriendo métodos de pago de la base de datos remota')
        s.waitUntil(database.refreshCollection('/payment_methods', 'payment_methods')) 
    }
});

self.addEventListener('message', m => {
    console.log(m)
    if(m.data === 'tabOpened'){ clients.claim() }
    if(m.data === 'SSE'){
        !SSE ? SSE = new SSEengine() : null;
    }
    if(m.data === 'signout'){ if(SSE){ SSE.close() }}
});

