class ListClients extends HTMLElement {
    constructor(){
        super();
        this.collection = "clients"; //Colección en IndexedDB
        this.APIURL = "clients"; //URL de la API del componente
        this.attachShadow({ mode : 'open' });
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();
        this.searchForm= this.shadowRoot.getElementById('form');
        this.addButton = this.searchForm["addBtn"];
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
            <form id="form">
                <input type="button" id="addBtn" value="Nuevo">
            </form>
            <hr>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th> 
                        <th>Apellido</th>
                        <th>Razón social</th>
                        <th>Identificación</th>
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
                    <td>${obj.nombre || 'Sin nombre'}</td>
                    <td>${obj.apellido || 'Sin apellido'}</td>
                    <td>${obj.razon_social || 'Sin razón social'}</td>
                    <td>${obj.identificacion || 'Sin identificación'} </td>
                    <td><button data-edit-id="${obj._id}">Editar</button></td>
                    <td><button data-delete-id="${obj._id}">Borrar</button></td>
                </tr>`;
        })
        return table;
    }
    //Rellenar el componente
    innerTable(data){ this.table.innerHTML = this.makeTableContent(data) }
    //Lógica entre worker y componente
    queryGetAll(){ worker.postMessage({ component : "list", collection : this.collection, query : 'getAll' }) }

    connectedCallback(){
        worker.addEventListener('message', this.wListener =  m => {
            if(m.data.collection === this.collection && m.data.component === 'list') { this.innerTable(m.data.obj) }
        });

        navigator.serviceWorker.addEventListener('message', this.swListener = e => {
            if(e.data.updated === this.collection){ this.queryGetAll() }
        });

        this.addButton.addEventListener('click', e => {
            e.preventDefault();
            this.modalContainer.innerHTML = '<add-clients></add-clients>'
        })

        this.table.addEventListener('click', e => {
            if(e.target.hasAttribute('data-edit-id')){
                this.modalContainer.innerHTML = `<edit-clients object-id="${e.target.attributes['data-edit-id'].value}"></edit-clients>`;
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
class AddClient extends HTMLElement {
    constructor(){
        super();
        this.collection = "clients"; //Colección en IndexedDB
        this.APIURL = "clients"; //URL de la API del componente
        this.attachShadow({ mode : 'open' });
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();
        this.addForm = this.shadowRoot.getElementById('form');
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
                <label for="surname">Apellido</label>
                <input type="text" name="surname" id="surname" >
                <label for="social_reason">Razón social</label>
                <input type="text" name="social_reason" id="social_reason" >
                <label for="identification">Identificación</label>
                <input type="text" name="identification" id="identification" >
                <input type="submit" id="add" value="Agregar">
                <input type="button" id="cancel" value="Cancelar">
            </form>`
    }

    formData(){
        return {
            nombre : String(this.addForm["name"].value),
            apellido : String(this.addForm["surname"].value),
            razon_social : String(this.addForm["social_reason"].value),
            identificacion : String(this.addForm["identification"].value)
        }
    }

    connectedCallback(){

        worker.addEventListener('message', this.wListener =  m => {
            if(m.data.collection === this.collection && m.data.component === 'add') { this.makePickerData(m.data) }
        });

        this.addForm.addEventListener('submit', e => {
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

    }

    disconnectedCallback(){
        worker.removeEventListener('message', this.wListener);
        window.removeEventListener('keyup', this.listenerKeyUp);
    }

}

class EditClient extends HTMLElement {
    get objectId(){ return this.getAttribute('object-id') }
    constructor(){
        super();
        this.collection = 'clients';
        this.APIURL = 'clients';
        this.attachShadow({mode : 'open'});
        this.shadowRoot.innerHTML += this.componentCSS();
        this.shadowRoot.innerHTML += this.componentHTML();   
        this.editForm = this.shadowRoot.getElementById('editForm');
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
            </style>
        `;
    }

    componentHTML(){
        return `
            <form id="editForm">
                <label for="id">ID interno</label>
                <input type="text" name="id" id="id" value="${this.objectId}" readonly>
                <input type="text" name="name" id="name" required>
                <label for="surname">Apellido</label>
                <input type="text" name="surname" id="surname" >
                <label for="social_reason">Razón social</label>
                <input type="text" name="social_reason" id="social_reason" >
                <label for="identification">Identificación</label>
                <input type="text" name="identification" id="identification" >
                <input type="submit" id="modify" value="Modificar">
                <input type="button" id="cancel" value="Cancelar">
            </form>
        `;
    }

    formData(){
        return {
            id : String(this.objectId),
            nombre : String(this.editForm["name"].value),
            apellido : String(this.editForm["surname"].value),
            razon_social :  Number(this.editForm["social_reason"].value),
            identificacion : String(this.editForm["identification"].value) 
        }
    }

    innerData(data){
        this.editForm["name"].value = data.nombre,
        this.editForm["surname"].value = data.apellido,
        this.editForm["social_reason"].value = data.razon_social,
        this.editForm["identification"].value = data.identificacion
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

        this.editForm.addEventListener('submit', e => {
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
window.customElements.define('list-clients', ListClients)
window.customElements.define('add-clients', AddClient)
window.customElements.define('edit-clients', EditClient)