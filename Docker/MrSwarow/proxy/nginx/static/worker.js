class IDB {
    constructor(entity, storeName){
        this.version = 5;
        this.entity = entity;
        this.storeName = storeName;
        this.db;
        this.transaction;
        this.request = indexedDB.open(this.entity, this.version);
        
        this.request.onupgradeneeded = e => {
            let db = e.target.result;
            let objStore = db.createObjectStore('products', { keyPath : "_id", autoIncrement : false })
            objStore.createIndex("entidad", "entidad", { unique : false})
            objStore.createIndex("codigo", "codigo", { unique : false})
            objStore.createIndex("nombre", "nombre", { unique : false})
            objStore.createIndex("marca", "marca", { unique : false})
            objStore.createIndex("categoria", "categoria", { unique : false})
            objStore.createIndex("precio", "precio", { unique : false})
            db.createObjectStore('sales', { keyPath : "_id", autoIncrement : false })
            db.createObjectStore('clients', { keyPath : "_id", autoIncrement : false })
            db.createObjectStore('payment_methods', { keyPath : "_id", autoIncrement : false })

        }
        this.request.onerror = e => console.log(`Error al abrir la base de datos ${e}`);
        this.request.onsuccess = e => {
            this.db = this.request.result;
        };
    }

    getParams(component, collection, param, index){ 
        let res = [];
        this.db.transaction(collection, 'readonly')
        .objectStore(collection)
        .index(index)
        .openCursor(IDBKeyRange.bound(param, param+'z')).onsuccess = e => {
            let cursor = e.target.result;
            if(cursor){
                res.push(cursor.value)
                cursor.continue();
            }
            else{ postMessage({ component : component, collection : collection, obj : res }) }
        }
    }
    getAll(component, collection){ 
        this.db.transaction(collection, 'readonly')
        .objectStore(collection)
        .getAll()
        .onsuccess = e => postMessage({ component : component, collection : collection, obj : e.target.result }) }
    getId(component, collection, id){ 
        this.db.transaction(collection, 'readonly')
        .objectStore(collection)
        .get(id)
        .onsuccess = e => postMessage({ component : component, collection : collection, obj : e.target.result }) }
    delete(component, collection, id){ 
        this.db.transaction(collection, 'readwrite')
        .objectStore(collection)
        .delete(id)
        .onsuccess = e => postMessage({ component : component, collection : collection}) }
}

let database = new IDB("test", "products");

self.addEventListener('message', e => {
        e.data.query === 'getParams' ? database.getParams(e.data.component, e.data.collection, e.data.param, e.data.index) :
        e.data.query === 'getAll' ? database.getAll(e.data.component, e.data.collection) :
        e.data.query === 'getId' ? database.getId(e.data.component, e.data.collection, e.data.id) :
        e.data.query === 'delete' ? database.delete(e.data.component, e.data.collection, e.data.id) :
        postMessage({ error : `${e.data.collection} can't ${e.data.query}` })
})