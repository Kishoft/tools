class ListProducts extends HTMLElement {
    constructor(){
        super();
        this.collection = "products"; //Colección en IndexedDB
        this.APIURL = "products"; //URL de la API del componente
        this.attachShadow({ mode : 'open' });
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();
        this.searchForm= this.shadowRoot.getElementById('productsForm');
        this.filter = this.searchForm["filter"];
        this.searchInput = this.searchForm["input"];
        this.clearButton = this.searchForm["clear"];
        this.addButton = this.searchForm["add"];
        this.table = this.shadowRoot.getElementById('tableContent');
        this.modalContainer = this.shadowRoot.getElementById('modals');
        navigator.serviceWorker.ready.then(r => r.active.postMessage('SSE'));
    }

    componentCSS(){
        return ``
    }

    componentHTML(){
        return `
            <h1>${this.collection}</h1>
            <form id="productsForm">
                <fieldset>
                <legend>Filtro</legend>
                    <input type="radio" id="codigo" name="filter" value="codigo">
                    <label for="codigo">Código</label>
                    <input type="radio" id="nombre" name="filter" value="nombre" checked>
                    <label for="nombre">Nombre</label>
                    <input type="radio" id="marca" name="filter" value="marca">
                    <label for="marca">Marca</label>
                    <input type="radio" id="categoria" name="filter" value="categoria">
                    <label for="categoria">Categoría</label>  
                </fieldset>
                <fieldset>
                <legend>Buscar</legend>
                    <input type="text" id="input">
                    <input type="button" id="clear" value="Limpiar">
                </fieldset>
                <input type="button" id="add" value="Nuevo">
            </form>
            <hr>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th> 
                        <th>Marca</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody id="tableContent">
                </tbody>
            </table>
            <section id="modals"></section>
        `;
    }

    //Relleno del componente
    makeTableContent(data){
        let table = "";
        data.forEach(obj => {
            table += 
                `<tr>
                    <td>${obj.codigo || 'Sin código'}</td>
                    <td>${obj.nombre || 'Sin nombre'}</td>
                    <td>${obj.marca || 'Sin marca'}</td>
                    <td>${obj.categoria || 'Sin categoría'}</td>
                    <td>${obj.precio.divisa || 'ARS'} ${obj.precio.valor || 0}</td>
                    <td><button data-edit-id="${obj._id}">Editar</button></td>
                    <td><button data-delete-id="${obj._id}">Borrar</button></td>
                </tr>`;
        })
        return table;
    }
    //Rellenar el componente
    innerTable(data){ this.table.innerHTML = this.makeTableContent(data) }
    //Lógica del filtro
    filterTable(){ this.searchInput.value === "" ? this.queryGetAll() : this.queryGetParams(String(this.searchInput.value), String(this.filter.value)) }
    //Lógica entre worker y componente
    queryGetParams(param, index){ worker.postMessage({ component : "list", collection : this.collection, query : 'getParams', param : param, index : index }) }
    queryGetAll(){ worker.postMessage({ component : "list", collection : this.collection, query : 'getAll' }) }

    connectedCallback(){
        worker.addEventListener('message', this.wListener =  m => {
            if(m.data.collection === this.collection && m.data.component === 'list') { this.innerTable(m.data.obj) }
        });

        navigator.serviceWorker.addEventListener('message', this.swListener = e => {
            if(e.data.updated === this.collection){ this.filterTable() }
        });

        this.searchInput.addEventListener('input', () => this.filterTable())
        
        this.clearButton.addEventListener('click', e => { 
            e.preventDefault();
            this.searchForm.reset();
            this.filterTable() 
        })

        this.addButton.addEventListener('click', e => {
            e.preventDefault();
            this.modalContainer.innerHTML = '<add-products></add-products>'
        })

        this.table.addEventListener('click', e => {
            if(e.target.hasAttribute('data-edit-id')){
                this.modalContainer.innerHTML = `<edit-products object-id="${e.target.attributes['data-edit-id'].value}"></edit-products>`;
            }
            else if(e.target.hasAttribute('data-delete-id')){
                navigator.serviceWorker.ready.then(r => {
                    r.sync.register(
                        Router.delete(this.APIURL, { id : String(e.target.attributes['data-delete-id'].value) })
                        .then(res => { res.ok ? console.log('Elemento eliminado con éxito del servidor') : alert('Error al eliminar el producto') })
                    )
                })
            }
        }, false)

        this.queryGetAll();

        this.searchInput.focus()

    }

    disconnectedCallback(){
        worker.removeEventListener('message', this.wListener);
        navigator.serviceWorker.removeEventListener('message', this.swListener);
    }
}
class AddProduct extends HTMLElement {
    constructor(){
        super();
        this.collection = "products"; //Colección en IndexedDB
        this.APIURL = "products"; //URL de la API del componente
        this.attachShadow({ mode : 'open' });
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();
        this.productForm = this.shadowRoot.getElementById('form');
        this.cancelButton = this.shadowRoot.getElementById('cancel');
    }

    componentCSS(){
        return `
            <style>
                :host{
                    position:absolute;
                    top:0;
                    width:100%;
                    height:100%;
                    display: grid;
                    place-items:center;
                    background:white;
                }
                form{
                    display: grid;
                    place-items:center;
                }
            </style>`;
    }

    componentHTML(){
        return `
            <form id="form">
                <label for="code">Código</label>
                <input type="text" name="code" id="code">
                <label for="name">Nombre</label>
                <input type="text" name="name" id="name" required>
                <label for="mark">Marca</label>
                <input type="text" name="mark" id="mark">
                <label for="category">Categoría</label>
                <select name="category" id="category">
                    <option value="none" selected>Ninguna</option>
                </select>
                <label for"provider">Proveedor</label>
                <select name="provider" id="provider">
                </select>
                <label for="currency">Moneda</label>
                <select name="currency" id="currency">
                    <option value="ARS" selected>Pesos Argentinos</option>
                    <option value="USD">Dólares de EEUU</option>
                </select>
                <label for="price">Precio</label>
                <input type="number" name="price" id="price" required>
                <input type="submit" id="add" value="Agregar">
                <input type="button" id="cancel" value="Cancelar">
            </form>`
    }

    formData(){
        return {
            codigo : String(this.productForm["code"].value),
            nombre : String(this.productForm["name"].value),
            marca : String(this.productForm["mark"].value),
            categoria : String(this.productForm["category"].value),
            precio : {
                valor: Number(this.productForm["price"].value),
                divisa: String(this.productForm["currency"].value)
            }
        }
    }

    makePickerData(data){
        let providers = "";
        data.obj.forEach(o => { this.productProvider.innerHTML += `<option value"${o._id}">${o.nombre}</options>` })
        return providers
    }

    queryGetAll(){ worker.postMessage({ component : "add", collection : this.collection, query : 'getAll' }) }

    connectedCallback(){

        worker.addEventListener('message', this.wListener =  m => {
            if(m.data.collection === this.collection && m.data.component === 'add') { this.makePickerData(m.data) }
        });

        this.productForm.addEventListener('submit', e => {
            e.preventDefault();
            navigator.serviceWorker.ready.then(r => {
                r.sync.register(
                    Router.post(this.APIURL, this.formData())
                    .then(res => { res.ok ? this.remove() : alert('Error al guardar el producto') })
                )
            });
        })

        this.cancelButton.addEventListener('click', e => this.remove())

        window.addEventListener('keyup', this.listenerKeyUp = e => { if(e.key === "Escape"){ this.remove() } } )

        this.queryGetAll()
    }

    disconnectedCallback(){
        worker.removeEventListener('message', this.wListener);
        window.removeEventListener('keyup', this.listenerKeyUp);
    }

}

class EditProduct extends HTMLElement {
    get objectId(){ return this.getAttribute('object-id') }
    constructor(){
        super();
        this.collection = 'products';
        this.APIURL = 'products'
        this.attachShadow({mode : 'open'});
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();   
        this.form = this.shadowRoot.getElementById('form');
        this.code = this.shadowRoot.getElementById('code');
        this.name = this.shadowRoot.getElementById('name');
        this.mark = this.shadowRoot.getElementById('mark');
        this.category = this.shadowRoot.getElementById('category');
        this.currency = this.shadowRoot.getElementById('currency');
        this.price = this.shadowRoot.getElementById('price');
        this.cancelButton = this.shadowRoot.getElementById('cancel');
        this.shadowRoot.getElementById('test').addEventListener('click', e => { e.preventDefault(); console.log(this.form) })
    }

    componentCSS(){
        return `
            <style>
                :host{
                    position:absolute;
                    top:0;
                    width:100%;
                    height:100%;
                    display: grid;
                    place-items:center;
                    background:white;
                }
                form{
                    display: grid;
                    place-items:center;
                }
            </style>
        `;
    }

    componentHTML(){
        return `
            <form id="form">
                <label for="id">ID interno</label>
                <input type="text" name="id" id="id" value="${this.objectId}" readonly>
                <label for="code">Código</label>
                <input type="text" name="code" id="code" value="">
                <label for="name">Nombre</label>
                <input type="text" name="name" id="name" value="" required>
                <label for="mark">Marca</label>
                <input type="text" name="mark" id="mark" value="">
                <label for="category">Categoría</label>
                <select name="category" id="category">
                    <option value="none" selected>Ninguna</option>
                </select>
                <label for="currency">Moneda</label>
                <select id="currency">
                    <option value="ARS">Pesos Argentinos</option>
                    <option value="USD">Dólares Estadounidenses</option>
                    <option value="URU">Pesos Uruguayos</option>
                </select>
                <label for="price">Precio</label>
                <input type="number" name="price" id="price" value="" required>
                <input type="submit" id="modify" value="Modificar">
                <input type="button" id="cancel" value="Cancelar">
                <button id="test">test</button>
            </form>
        `;
    }

    formData(){
        return {
            id : String(this.objectId),
            codigo : String(this.code.value),
            nombre : String(this.name.value),
            marca : String(this.mark.value),
            categoria : String(this.category.value),
            precio : {
                valor : Number(this.price.value),
                divisa : String(this.currency.value) 
            }
        }
    }

    innerData(data){
        this.code.value = data.codigo,
        this.name.value = data.nombre,
        this.mark.value = data.marca,
        this.category.value = data.categoria,
        this.currency.value = data.precio.divisa,
        this.price.value = data.precio.valor,
        console.log(data.moneda)
    }

    queryGetId(id){ worker.postMessage({ component : "edit", collection : this.collection, query : 'getId', id : id }) }

    connectedCallback(){

        worker.addEventListener('message', this.wListener =  m => {
            if(m.data.collection === this.collection && m.data.component === 'edit') { this.innerData(m.data.obj) }
        });

        navigator.serviceWorker.addEventListener('message', this.swListener = e => {
            if(e.data.updated === this.collection){ this.queryGetId(this.objectId) }
        });

        window.addEventListener('keyup', this.listenerKeyUp = e => { if(e.key === "Escape"){ this.remove() } } )

        this.form.addEventListener('submit', e => {
            e.preventDefault();
            navigator.serviceWorker.ready.then(r => {
                r.sync.register(
                    Router.put(this.APIURL, this.formData())
                    .then(res => { res.ok ? this.remove() : alert('Error al modificar el producto') })
                )
            })
        })

        this.cancelButton.addEventListener('click', e => this.remove())

        this.queryGetId(this.objectId)

    }
    disconnectedCallback(){
        worker.removeEventListener('message', this.wListener);
        navigator.serviceWorker.removeEventListener('message', this.swListener);
        window.removeEventListener('keyup', this.listenerKeyUp);
    }
}
window.customElements.define('list-products', ListProducts)
window.customElements.define('add-products', AddProduct)
window.customElements.define('edit-products', EditProduct)