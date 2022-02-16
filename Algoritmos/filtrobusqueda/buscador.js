class BuscadorProductos extends HTMLElement {

    constructor(){
        super();


        this.style.position = "fixed";
        this.style.top = "70px";
        this.style.width = "100%";
        this.style.backgroundColor = "white";
        this.style.padding = "5px 8px";

        this.formulario = document.createElement('form')
        this.formulario.id = "formulario"
        this.formulario.addEventListener('submit', e => {
            e.preventDefault();
            console.log(e)
            console.log(this.formulario["buscador"].value)
            this.buscar(this.formulario["buscador"].value)
        })

        this.buscador = document.createElement('input')
        this.buscador.type = "search";
        this.buscador.name = "buscador";
        this.buscador.id = "buscador";
        this.buscador.setAttribute("list", "productos");
        this.buscador.style.padding = "5px 8px";

        this.datalist = document.createElement('datalist');
        this.datalist.id = "productos";

        this.btnSubmit = document.createElement('input')
        this.btnSubmit.type = "submit";
        this.btnSubmit.value = "Buscar"
        this.btnSubmit.style.backgroundColor = "white";
        this.btnSubmit.style.border = "1px solid gray";
        this.btnSubmit.style.padding = "5px 8px";
        this.btnSubmit.style.marginLeft = "10px";

        this.formulario.appendChild(this.buscador)
        this.formulario.appendChild(this.datalist)
        this.formulario.appendChild(this.btnSubmit)

        this.contenedor = document.getElementById('vbid-daf6a-byhlrxds')
        .childNodes[3].children[0].children[2].children[1].children[0]
        
        this.attachShadow({ mode : "open" });

        this.shadowRoot.appendChild(this.formulario)
    }
    

    indexar() {
        this.contenedor.childNodes.forEach(e => {
            if (e.children) {
                let elemento = e.children[0].children[0]
                let elementoId = elemento.attributes['data-self']
                let titulo = elemento.children[0].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[1].children[0].textContent.trim()
                let precio = elemento.children[0].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[7].children[0].textContent.trim()
                this.datalist.innerHTML += `<option value="${titulo}">${elementoId.value}</option>`
            }
        })
    }

    buscar(parametro) {
        this.contenedor.childNodes.forEach(e => {
            if (e.children) {
                let elemento = e.children[0]
                    .children[0]
                let elementoId = elemento.attributes['data-self']
                let titulo = elemento.children[0].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[1].children[0].textContent.trim()
                let precio = elemento.children[0].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[7].children[0].textContent.trim()
                if (titulo.includes(parametro)) {
                    elemento.scrollIntoView();
                }
            }
        })
    }

    connectedCallback(){ 
        this.indexar()
    }

}
customElements.define('buscador-productos', BuscadorProductos)