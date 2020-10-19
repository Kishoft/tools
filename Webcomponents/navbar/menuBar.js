class NavBar extends HTMLElement{

    constructor(){

        super();

        //Creamos el shadowRoot
        this.attachShadow({mode : 'open'})

        //Estilos
        this.css = document.createElement('link');
        this.css.rel = 'stylesheet';
        this.css.href = './menuBar.css';
        this.shadowRoot.appendChild(this.css);

        //Barra
        this.bar = document.createElement('nav')

        //ToggleButton
        this.toggleButton = document.createElement('div');
        this.toggleButton.id = "toggleButton";
        this.toggleButton.addEventListener('click', e => {
            this.open()
        })

        this.buttonBar1 = document.createElement('div')
        this.buttonBar1.id = 'toggleBar1';

        this.buttonBar2 = document.createElement('div')
        this.buttonBar2.id = 'toggleBar2';

        this.buttonBar3 = document.createElement('div')
        this.buttonBar3.id = 'toggleBar3';

        //Contenedor principal
        this.principalContent = document.createElement('nav')
        this.principalContent.id = "principalContent";

        //Contenedor de la derecha
        this.rightContent = document.createElement('div');
        this.rightContent.id = "rightContent";

        //Slots
        this.slot1 = document.createElement('slot');

        this.slot2 = document.createElement('slot');
        this.slot2.name = "rightContent";


        //Agregar contenido

        this.shadowRoot.appendChild(this.bar);

        this.bar.appendChild(this.toggleButton);
        this.bar.appendChild(this.principalContent);
        this.bar.appendChild(this.rightContent);

        this.toggleButton.append(this.buttonBar1, this.buttonBar2, this.buttonBar3);

        this.principalContent.appendChild(this.slot1);
        this.rightContent.appendChild(this.slot2);


        
        
    }

    open(){
        if(this.hasAttribute('open')){ this.removeAttribute('open') }
        else{ this.setAttribute('open', '') }
    }

    closeIfOutside(e){
        if(e.target === !this || !this.contains(e.target) || e.path[2].tagName === 'NAV'){
            if(this.hasAttribute('open')){
                this.open()
            }
        }
    }

    connectedCallback(){
        document.addEventListener('click', this.menuListener = e => {
            this.closeIfOutside(e)
        })
    }
    
    disconnectedCallback(){
        document.removeEventListener('click', this.menuListener)
    }

}

window.customElements.define('nav-bar', NavBar)