class Modal extends HTMLElement {
    constructor(){
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML =`
            <div class="modal-content">
            <div class="modal-button-close">
                <div class="modal-icon-close">
                    <div class="barra1"></div>
                    <div class="barra2"></div>
                </div>
            </div>
                <slot></slot>
            </div>     
            <style>
                :host{
                    position: fixed;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    top: 0px;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                }
                .modal-content{
                    position:relative;
                    display:flex;
                    flex-wrap:wrap;
                    justify-content:center;
                    align-items:center;
                    width:auto;
                    height: auto;
                    max-height: 80%;
                    max-width:80%;
                    background-color: #f1f1f1;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
                }
                .modal-button-close{
                    position:absolute;
                    right:0;
                    top:0;
                    cursor:pointer;
                    margin: 5px;
                    padding: 4px;
                    border: 1px solid #e2e1e0;
                    border-radius: 4px;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                }
                .barra1, .barra2 {
                    width: 35px;
                    height: 5px;
                    margin: 6px 0;
                    background-color: black;
                    transition: all .3s ease
                }
                .barra1 {
                    transform: rotate(-45deg) translate(-4px, 3px) ;
                }
                .barra2 {
                    transform: rotate(45deg) translate(-3px, -4px) ;
                }
            </style>
        `
    }
    cerrarModalEsc(e){
        if (e.key === "Escape"){ this.remove() }
    }
    detectIfModal(e){
        if(e.path[0] == this){ this.remove() }
        else{ if(e.path[0].classList == 'modal-button-close' || e.path[0].classList == 'modal-icon-close'){ this.remove() } }
        return false;
    }
    connectedCallback(){
        this.addEventListener('click', (e) => this.detectIfModal(e), false);
        window.addEventListener('keyup', this.listener = (e) => this.cerrarModalEsc(e))
    }
    disconnectedCallback(){
        window.removeEventListener('keyup', this.listener)
    }
}
window.customElements.define('modal-window', Modal)