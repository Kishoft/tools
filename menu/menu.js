class AppMenu extends HTMLElement {
    get open(){ return this.hasAttribute('open') }
    set open(val){
        if(val){ this.setAttribute('open','') }
        else { this.removeAttribute('open') }
    }
    constructor(){
        super();
        this.open = false;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML += `
            <div id="toggle-button">
                <div class="icon-menu">
                    <div class="barra1"></div>
                    <div class="barra2"></div>
                    <div class="barra3"></div>
                </div>
            </div>
            <div id="content">
                <div id="alwaysOnTopLeft">
                    <slot name="alwaysOnTopLeft"></slot>
                </div>
                <div id="sideContent">
                    <slot name="sideContent"></slot>
                </div>
                <div id="alwaysOnTopRight">
                <slot name="alwaysOnTopRight"></slot>
            </div>
            </div>
        <style>
        #alwaysOnTopLeft, #alwaysOnTopRight{
            display:flex;
            align-items:center;
            justify-content:flex-end;
        }
        #sideContent{
            width:80%
        }
        #content{
            display:flex;
            height:55px;
            width:100%;
            justify-content:space-between
        }
        :host{
            width: 100%;
            z-index: 1001;
            top: 0;
            box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        }
        :host([sticky]){
            position: sticky;
        }
        :host([fixed]){
            position: fixed;
        }
        ::slotted(img){
            width:100%;
        }
        @media (max-width: 650px){
            #toggle-button {
                display: inline-block;
                width:35px;
                height: 39px;
                cursor: pointer;
                margin: 6px;
                padding: 0 6px 0 6px;
                border: 1px solid #e2e1e0;
                border-radius: 4px;
                box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
            }
            .barra1, .barra2, .barra3 {
                width: 35px;
                height: 5px;
                margin: 6px 0;
                background-color: black;
                transition: all .3s ease
            }
            :host([open]) .barra1 {
                transform: rotate(-45deg) translate(-9px, 6px) ;
            }
            :host([open]) .barra2 {
                opacity: 0;
            }
            :host([open]) .barra3 {
                transform: rotate(45deg) translate(-8px, -8px) ;
            }
            :host{
                display:inline-flex;
            }
            #sideContent{
                height:100%;
                position:fixed;
                left:-100%;
                top:55px;
                transition: all .3s ease;        
            }
            :host([open]) #sideContent{
                left:0%;
            }
        }
        @media (min-width: 650px){
            #content{
                margin:auto;
                width: 80%;
            }
            #alwaysOnTopLeft, #alwaysOnTopRight{
                width:20%;
            }
        }
    </style>
        `;
    }
    toggleOpen(){
        if(this.open){ this.open = false } 
        else{ this.open = true }
    }
    toggleIfOutside(e){
        if(window.matchMedia('(max-width: 650px').matches){
            if(this.open){
                if(e.target == this || this.contains(e.target)){
                    if(e.target.tagName == 'A'){ this.toggleOpen() }
                    return 0;
                }
                else{ this.toggleOpen() }
            }
        }
    }
    connectedCallback(){
        this.shadowRoot.getElementById('toggle-button').addEventListener('click', () => this.toggleOpen());
        document.addEventListener('click', this.listener = (e)=> this.toggleIfOutside(e))
    }
    disconnectedCallback(){
        document.removeEventListener('click', this.listener)
    }
}
window.customElements.define('app-menu', AppMenu)