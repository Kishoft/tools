class ListPaymentMethods extends HTMLElement {
    constructor(){
        super();
        this.collection = "payment_methods"; //Colección en IndexedDB
        this.APIURL = "payment_methods"; //URL de la API del componente
        this.attachShadow({ mode : 'open' });
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();
        this.addButton = this.shadowRoot.getElementById('add')
        this.pmContainer = this.shadowRoot.getElementById('pmContainer');
        this.modalContainer = this.shadowRoot.getElementById('modalsContainer');
        navigator.serviceWorker.ready.then(r => r.active.postMessage('SSE'));
    }

    componentCSS(){
        return ``
    }

    componentHTML(){
        return `
            <h1>${this.collection}</h1>
            <input type="button" id="add" value="Nuevo">
            <div id="pmContainer"></div>
            <section id="modalsContainer"></section>
        `;
    }

    //Relleno del componente
    makeContent(data){
        let container = "";
        data.forEach(obj => {
            container += `
                <table>
                    <caption>${obj.nombre}</caption>
                    <thead>
                        <tr>
                            <th>Cantidad de pagos</th>
                            <th>Recargo por pago</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            obj.cuotas.forEach(c => {
                container += `
                    <tr>
                        <td>${c.cantidad}</td>
                        <td>${c.recargo}</td>
                    </tr>
                `;
            })
            container += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                <button data-edit-id="${obj._id}">Editar</button>
                            </td>
                            <td>
                                <button data-delete-id="${obj._id}">Eliminar</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            `;
        })
        return container;
    }
    //Rellenar el componente
    innerContent(data){ this.pmContainer.innerHTML = this.makeContent(data) }
    //Lógica entre worker y componente
    queryGetParams(param, index){ worker.postMessage({ component : "list", collection : this.collection, query : 'getParams', param : param, index : index }) }
    queryGetAll(){ worker.postMessage({ component : "list", collection : this.collection, query : 'getAll' }) }

    connectedCallback(){
        worker.addEventListener('message', this.wListener =  m => {
            if(m.data.collection === this.collection && m.data.component === 'list') { this.innerContent(m.data.obj) }
        });

        navigator.serviceWorker.addEventListener('message', this.swListener = e => {
            if(e.data.updated === this.collection){ this.queryGetAll() }
        });

        this.addButton.addEventListener('click', e => {
            e.preventDefault();
            this.modalContainer.innerHTML = '<add-payment_methods></add-payment_methods>'
        })

        this.pmContainer.addEventListener('click', e => {
            if(e.target.hasAttribute('data-edit-id')){
                this.modalContainer.innerHTML = `<edit-payment_methods collection="${this.collection}" object-id="${e.target.attributes['data-edit-id'].value}"></edit-payment_methods>`;
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

    }

    disconnectedCallback(){
        worker.removeEventListener('message', this.wListener);
        navigator.serviceWorker.removeEventListener('message', this.swListener);
    }
}
class AddPaymentMethod extends HTMLElement {
    constructor(){
        super();
        this.collection = "payment_methods"; //Colección en IndexedDB
        this.APIURL = "payment_methods"; //URL de la API del componente
        this.attachShadow({ mode : 'open' });
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();
        this.pmForm = this.shadowRoot.getElementById('form');
        this.addButton = this.shadowRoot.getElementById('add');
        this.quotas= 1
        this.quotaContainer = this.shadowRoot.getElementById('quota');
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
                <label for="name">Nombre</label>
                <input type="text" name="name" id="name" required>
                <table>
                <caption>Cuotas</caption>
                    <thead>
                        <tr>
                            <td>Cantidad</td>
                            <td>Recargo</td>
                            <td><input type="button" id="add" value="+"></td>
                        </tr>
                    </thead>
                    <tbody id="quota">
                        <tr>
                            <td><input type="number" name="quantity" value="1" required></td>
                            <td><input type="number" name="recharge" value="0" required></td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" id="create" value="Crear">
                <input type="button" id="cancel" value="Cancelar">
            </form>`
    }

    addQuota(){
        this.quotas++
        this.quotaContainer.innerHTML +=
        `
        <tr>
            <td><input type="number" name="quantity" value="${this.quotas}" required></td>
            <td><input type="number" name="recharge" value="" required></td>
        </tr>
        `
    }

    formData(){

        let cuotas = []

        for (let i = 0; i < this.pmForm["quantity"].length; i++) {
            cuotas.push({
                cantidad : this.pmForm["quantity"][i].value,
                recargo : this.pmForm["recharge"][i].value
            })
        }
        
        return {
            nombre : String(this.pmForm["name"].value),
            cuotas : cuotas,
        }
    }

    connectedCallback(){

        this.pmForm.addEventListener('submit', e => {
            e.preventDefault();
            navigator.serviceWorker.ready.then(r => {
                r.sync.register(
                    Router.post(this.APIURL, this.formData())
                    .then(res => { res.ok ? this.remove() : alert('Error al guardar el método de pago') })
                )
            });
        })

        this.addButton.addEventListener('click', e =>{ 
            e.preventDefault();
            this.addQuota()
        })

        this.cancelButton.addEventListener('click', e => this.remove())

        window.addEventListener('keyup', this.listenerKeyUp = e => { if(e.key === "Escape"){ this.remove() } } )

    }

    disconnectedCallback(){
        window.removeEventListener('keyup', this.listenerKeyUp);
    }

}

class EditPaymentMethod extends HTMLElement {
    get objectId(){ return this.getAttribute('object-id') }
    constructor(){
        super();
        this.collection = 'payment_methods';
        this.APIURL = 'payment_methods'
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
            precio :  Number(this.price.value),
            moneda : String(this.currency.value) 
        }
    }

    innerData(data){
        this.code.value = data.codigo,
        this.name.value = data.nombre,
        this.mark.value = data.marca,
        this.category.value = data.categoria,
        this.currency.value = data.moneda,
        this.price.value = data.precio,
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
window.customElements.define('list-payment_methods', ListPaymentMethods)
window.customElements.define('add-payment_methods', AddPaymentMethod)
window.customElements.define('edit-payment_methods', EditPaymentMethod)