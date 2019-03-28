class navBar extends HTMLElement {
    get open(){ return this.hasAttribute('open') }
    set open(val){
        if(val){ this.setAttribute('open','') }
        else { this.removeAttribute('open') }
    }
    get barHeight(){ return this.getAttribute('height') || `55px` }
    constructor(){
        super();
        this.open = false;
        this.barHeight;
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
            <slot name="barBefore"></slot>
                <div id="navBarResponsiveContent">
                    <slot></slot>
                </div>
            <slot name="barAfter"></slot>
            </div>
        <style>
        :host{
            display:inline-flex;
            width: 100%;
            z-index: 1001;
            height:${this.barHeight};
            top: 0;
        }
        :host([sticky]){
            position: sticky;
        }
        :host([fixed]){
            position: fixed;
        }
        #content{
            width:100%;
            display:flex;
            justify-content:space-between;
        }
        #navBarResponsiveContent{
            display:flex;
        }
        @media (max-width: 650px){
            #toggle-button {
                display: inline-flex;
                align-self:center;
                width:35px;
                cursor: pointer;
                margin: 0 8px 0 8px;
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
            }
            #navBarResponsiveContent{
                height:calc(100vh - ${this.barHeight});
                position:fixed;
                width:80%;
                left:-100%;
                top:${this.barHeight};
                transition: all .3s ease;
                background-color:black;
                flex-direction:column;
            }
            :host([open]) #navBarResponsiveContent{
                left:0%;
            }
        }
        @media (min-width: 650px){
            #navBarResponsiveContent{
                width: 600px;
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
                //if(e.target == this || this.contains(e.target)){
                //    if(e.target.tagName == 'A'){ this.toggleOpen() }
                //    return 0;
                //}
                //else{ this.toggleOpen() }
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
document.body.innerHTML += `

<style>
    
</style>
`
window.customElements.define('nav-bar', navBar)