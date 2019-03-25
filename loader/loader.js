class Loader extends HTMLElement {
    constructor(){
        super();
        document.body.style.overflowY = 'hidden';
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML =`
        <slot></slot>
        <style>
            :host{
                position:fixed;
                display:flex;
                justify-content:center;
                align-items:center;
                top:0;
                background-color: black;
                width:100%;
                height:100%
            }
        </style>
        `
    }
    clearBody(){
        document.body.style.overflowY = `auto`;
        this.remove()
    }
    connectedCallback(){
        document.addEventListener('loadend', this.listener = this.clearBody())
    }
    disconnectedCallback(){
        document.removeEventListener('loaded', this.listener)
    }
}
window.customElements.define('app-loader', Loader)