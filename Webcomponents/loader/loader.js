class Loader extends HTMLElement {
    constructor(){
        super();
        document.body.style.overflowY = 'hidden';
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML =`
        <figure id="loader">
            <figcaption>
                <h1>Cargando</h1>
            </figcaption>
        </figure>
        <style>
            :host{
                position:fixed;
                top:0;
                left:0;
                width:100%;
                height:100vh;
                display:flex;
                justify-content:center;
                align-items:center;
                background-color: white;
                z-index: 9999;
                transition: all 1s linear;
                opacity: 1;
            }
            @keyframes desaparece{
                0%{ transform: scale(.9,.9) }
                30%{ transform: scale(1,1) }
                40%,100%{ transform: scale(0,0) }
            }
        </style>
        `
    }
    removeLoader(){
        document.body.style.overflowY = `auto`;
        this.remove();
    }
    connectedCallback(){
        window.addEventListener('load',e => this.removeLoader())
    }
}
window.customElements.define('page-loader', Loader)