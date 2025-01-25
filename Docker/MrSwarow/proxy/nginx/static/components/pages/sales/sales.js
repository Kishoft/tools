class ListSales extends HTMLElement {
    constructor(){
        super();
        this.collection = "sales"; //Colección en IndexedDB
        this.APIURL = "sales"; //URL de la API del componente
        this.attachShadow({ mode : 'open' });
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();
        
        this.addButton = this.shadowRoot.getElementById('add');
        this.salesForm = this.shadowRoot.getElementById('salesForm');
        this.salesContainer = this.shadowRoot.getElementById('sales');
        this.modalContainer = this.shadowRoot.getElementById('modals');

        navigator.serviceWorker.ready.then(r => r.active.postMessage('SSE'));
    }

    componentCSS(){
        return ``;
    }

    componentHTML(){
        return `
            <h1>${this.collection}</h1>
            <h3>Ventas/Pedidos</h3>
            <form id="salesForm">
                <input type="button" id="add" value="Nuevo">
            </form>
            <div id="sales"></div>
            <section id="modals"></section>
        `;
    }

    makeContent(data){
        let container = "";
        data.forEach(obj => {
            container += `
            <div class="sale">
                <h1>Cliente: ${obj.cliente || 'Ninguno'}</h1>
                <h2>Tipo: ${obj.tipo}</h2>
                <h3>Fecha de emisión: ${new Intl.DateTimeFormat('es-AR', { dateStyle : 'full', timeStyle : 'full' }).format(new Date(obj.fecha_emision))})</h3>
                <details>
                    <summary>Detalle</summary>
                    <div>${obj.detalles || 'Todavía no hay productos'}</div>
                </details>
                <h4>Medio de pago: ${obj.medio_de_pago || 'Ninguno'}</h4>
                <button data-edit-id="${obj._id}">Editar</button>
                <button data-delete-id="${obj._id}">Eliminar</button>
                <button data-dispatch-id="${obj._id}" >Terminar</button>
            </div>
            `
        })
        return container
    }

    innerContent(data){ this.salesContainer.innerHTML = this.makeContent(data) }

    queryGetAll(){ worker.postMessage({ component : "list", collection : this.collection, query : 'getAll' }) }

    connectedCallback(){
        worker.addEventListener('message', this.wListener =  m => {
            console.log(m)
            if(m.data.collection === this.collection && m.data.component === 'list') { this.innerContent(m.data.obj) }
        });

        navigator.serviceWorker.addEventListener('message', this.swListener = e => {
            if(e.data.updated === this.collection){ this.queryGetAll() }
        });

        this.addButton.addEventListener('click', e => {
            e.preventDefault();
            this.modalContainer.innerHTML = '<add-sales></add-sales>'
        })
/*
        this.table.addEventListener('click', e => {
            if(e.target.hasAttribute('data-edit-id')){
                this.modalContainer.innerHTML = `<edit-sales collection="${this.collection}" object-id="${e.target.attributes['data-edit-id'].value}"></edit-sales>`;
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
*/
        this.queryGetAll();

    }

    disconnectedCallback(){
        worker.removeEventListener('message', this.wListener);
        navigator.serviceWorker.removeEventListener('message', this.swListener);
    }
}
class AddSales extends HTMLElement {
    constructor(){
        super();
        this.collection = "sales"; //Colección en IndexedDB
        this.APIURL = "sales"; //URL de la API del componente
        this.attachShadow({ mode : 'open' });
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();
    }

    componentCSS(){
        return ``;
    }

    componentHTML(){
        return `
        <form id="form">
        <label for="esPedido">Es Pedido</label>
        <input type="text" name="esPedido" id="esPedido" value="">
        <label for="cliente">Cliente</label>
        <input type="text" name="cliente" id="cliente" value="">
        </form>
        `;
    }
    connectedCallback(){
    }

    disconnectedCallback(){
    }

}

class EditSales extends HTMLElement {
    get objectId(){ return this.getAttribute('object-id') }
    constructor(){
        super();
        this.collection = "sales";
        this.APIURL = "sales";
        this.attachShadow({mode : 'open'});
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();   
    }

    componentCSS(){
        return ``;
    }

    componentHTML(){
        return ``;
    }

    connectedCallback(){
    }
    disconnectedCallback(){
    }
}
window.customElements.define('list-sales', ListSales)
window.customElements.define('add-sales', AddSales)
window.customElements.define('edit-sales', EditSales)