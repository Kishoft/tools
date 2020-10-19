class navBar extends HTMLElement {
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
        this.css = document.createElement('link')
        this.css.rel = 'stylesheet'
        this.css.type = 'text/css'
        this.css.href = './navBar.css';
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML += `
        <style>

        
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
    connectedCallback(){
        this.shadowRoot.getElementById('toggle-button').addEventListener('click', () => this.toggleOpen());
        document.addEventListener('click', this.navbarListener = (e)=> this.toggleIfOutside(e));
    }
    disconnectedCallback(){
        document.removeEventListener('click', this.navbarListener)
    }
}
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