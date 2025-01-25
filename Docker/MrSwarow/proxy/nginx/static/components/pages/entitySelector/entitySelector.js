class EntitySelector extends HTMLElement {
    constructor(){
        super();
        const shadowRoot = this.attachShadow({ mode : 'open' });
        shadowRoot.innerHTML += 
        `
        <form id="form">
            <fieldset id="contratos">
                <legend>Seleccione una razón social</legend>
            </fieldset>
            <input type="submit" id="signin" value="Ingresar">
            <input type="button" id="cancel" value="Volver">
        </form>
        <style>
        :host{
            position:absolute;
            top:0;
            width:100%;
            height:100%;
            display: grid;
            place-items:center;
            background:orange;
        }
        form{
            display: grid;
            place-items:center;
        }
        </style>
        `

        this.form = this.shadowRoot.getElementById('form');
        this.contratosFieldset = this.shadowRoot.getElementById('contratos');
        this.cancelBtn = this.shadowRoot.getElementById('cancel')
        
    }
    connectedCallback(){

        Router.get('signin')
        .then(res => res.json())
        .then(resJSON => {
            console.log(resJSON)
            resJSON.forEach(obj => {
                this.contratosFieldset.innerHTML += 
                `
                <input type="radio" name="contrato" value="${obj._id}" id="${obj._id}">
                <label for="${obj._id}">${obj.entidad.razon_social}</label>
                `
            })            
        })
        .catch(e => console.log(e))

        this.form.addEventListener('submit', e => {

            e.preventDefault();

            Router.put('signin', { contrato : this.form.elements.contrato.value })
            .then(res => {
                if(res.ok){
                    this.remove();
                    return res.json();
                }
                else if (res.status === 401) { throw "No tenes permisos para operar ahí" }
                else { throw res.status } 
            })
            .then(resJSON => {
                localStorage.setItem('entity', resJSON.entity)
            })
            .catch(e => alert(e))

        })

        //this.cancelBtn = this.shadowRoot.getElementById('cancel');
        this.cancelBtn.addEventListener('click', () => this.remove())
        if(!localStorage.hasOwnProperty('entity')){ this.cancelBtn.style.display = "none" }
    }
}

window.customElements.define('entity-selector', EntitySelector)
