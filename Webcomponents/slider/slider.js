class Slider extends HTMLElement{
    constructor(){
        super()

        this.css = document.createElement('link')
        this.css.rel = 'stylesheet'
        this.css.type = 'text/css'
        this.css.href = './slider.css';
        this.attachShadow({mode: 'open'});


        this.contenido = document.createElement("slot")
        
        this.shadowRoot.appendChild(this.css)
        this.shadowRoot.appendChild(this.contenido)


    }
}
customElements.define("custom-slider", Slider)