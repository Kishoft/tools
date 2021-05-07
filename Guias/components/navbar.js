class navBar extends HTMLElement {
    //Hay que agregar más propiedades como colores y altura a la etiqueta
    get open(){ return this.hasAttribute('open') }
    set open(val){
        if(val){ this.setAttribute('open','') }
        else { this.removeAttribute('open') }
    }
    get barHeight(){ return this.getAttribute('height') || `3.5em` }
    constructor(){
        super();
        this.open = false;
        this.barHeight;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML += `
        <style>
            :host{
                display:flex;
                width: 100%;
                z-index: 1001;
                height:${this.barHeight};
                top: 0;
            }
            :host([fixed]){
                position: fixed;
            }
            #navBarContent{
                display:flex;
                align-items: center;
                justify-content: space-between;
                width:90%;
                margin:auto;
            }
            #navBarResponsiveContent{
                display:flex;
            }
            ::slotted(nav){
                display:flex;
                align-items: center;
            }
            @media (max-width: 650px){
                :host([sticky]){
                    position: fixed;
                }
                #toggle-button {
                    display: inline-flex;
                    align-self:center;
                    width:35px;
                    cursor: pointer;
                    margin: 0 8px 0 8px;
                    padding: 0 6px 0 6px;
                    border: 1px solid black;
                    border-radius: 4px;
                }
                .barra1, .barra2, .barra3 {
                    width: 35px;
                    height: 5px;
                    margin: 6px 0;
                    transition: all .3s ease;
                    background-color: black;
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
                #navBarResponsiveContent{
                    position:fixed;
                    top:55px;
                    left: -100%;
                    width: 80%;
                    transition: all .5s ease;
                    flex-direction:column;
                }
                :host([open]) #navBarResponsiveContent{
                    left:0
                }
                ::slotted(nav){
                    flex-direction: column;
                }
            }
            @media (min-width: 650px){
                :host([sticky]){
                    position: sticky;
                }
                #toggle-button{
                    display:none;
                }
                #navBarContent{
                }
            }
        </style>
        <div id="toggle-button">
            <div class="icon-menu">
                <div class="barra1"></div>
                <div class="barra2"></div>
                <div class="barra3"></div>
            </div>
        </div>
        <div id="navBarContent">
            <slot name="barBefore"></slot>
            <div id="navBarResponsiveContent">
                <slot></slot>
            </div>
            <slot name="barAfter"></slot>
        </div>
        `;
    shadowRoot.appendChild(this.css)
    }
    toggleOpen(){
        if(this.open){ this.open = false } 
        else{ this.open = true }
    }
    toggleIfOutside(e){
        if(window.matchMedia('(max-width: 650px)').matches){
            if(this.open){
                if(e.target == this || this.contains(e.target)){
                    if(e.path[1].tagName == 'NAV'){ this.toggleOpen() }
                    return 0;
                }
                else{ this.toggleOpen() }
            }
        }
    }
    //Usar el attribute changed callback para captar el open, cambios en altura y demás
    connectedCallback(){
        this.shadowRoot.getElementById('toggle-button').addEventListener('click', () => this.toggleOpen());
        document.addEventListener('click', this.navbarListener = (e)=> this.toggleIfOutside(e));
    }
    disconnectedCallback(){
        document.removeEventListener('click', this.navbarListener)
    }
}
//Agregar otro componente para crear los dropdown
document.body.innerHTML += `

<style>
    nav a{
        position:relative;
        display: inline-flex;
        padding:15px;
        text-align:center;
    }
    .dropdown:focus-within > nav,
    .dropdown:hover > a ~ nav{
        height: auto;
    }
    .dropdown nav{
        height: 0;
        overflow: hidden;
        flex-wrap: wrap;
    }
    @media (max-width: 650px){
        .dropdown{
            display:flex;
            flex-direction: column;
            align-items: center;
        }
        .dropdown > nav{
            display:flex;
            flex-direction: column;
        }
    }
    @media (min-width: 650px){
        .dropdown > nav{
            position:absolute;
        }
    }
</style>
`
window.customElements.define('nav-bar', navBar)