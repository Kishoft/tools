class SocialBar extends HTMLElement{
    static get observedAttributes(){ return ['open'] }
    get open(){ return this.hasAttribute('open') }
    set open(val){
        if(val){
            this.setAttribute('open','')
        }
        else {
            this.removeAttribute('open')
        }
    }
    constructor(){
        super();
        this.open = false;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>
            <div>
                <slot></slot>
                <a id="toggle-button"><slot name="toggle"></slot></span></a>
            </div>
            <style>
                :host > div{
                    filter: url(#goo);
                    position: relative;
                    display:grid;
                    place-items: center;
                    width:300px;
                    height:300px;
                }
                svg{ display:none }
                #toggle-button, ::slotted(a){
                    position:absolute;
                    text-decoration: none;
                    width: 80px;
                    height: 80px;
                    line-height: 80px;
                    border-radius: 100%;
                    font-size: 40px;
                }
                #toggle-button{
                    cursor:pointer;
                    background-color: var(--color5);
                }
                ::slotted(a){
                    transition: all .5s ease;
                    color: var(--color3);
                    background: var(--color1);
                }
                ::slotted(a:hover){
                    color: var(--color4);
                }
            </style>
        `
    }
    spreadOut(){
        for (let index = 0; index < this.menuItems.length; index++) {
            let angulo = ((Math.PI - this.openingAngle) / 2) + ((this.openingAngle / (this.menuItems.length - 1)) * index)
            let coseno = Math.cos(angulo) * this.openDistance;
            let seno = Math.sin(angulo) * this.openDistance
            console.log(`Angulo expresado en PI: ${angulo} \n Coseno: ${coseno} \n Seno: ${seno}`);
            this.menuItems[index].style['transform'] = `translate(${coseno}px, ${seno}px)`
        }
    }
    spreadIn(){
        for (let index = 0; index < this.menuItems.length; index++) {
            this.menuItems[index].style['transform'] = `translate(0px, 0px)`
        }
    }
    connectedCallback(){
        this.menuItems = this.getElementsByTagName('a');
        this.openingAngle = Math.PI - 0.2;
        this.openDistance = ((24 * this.menuItems.length ) - this.openingAngle);
        this.shadowRoot.getElementById('toggle-button').addEventListener('click', () => this.open = !this.open);
    }
    attributeChangedCallback(){
        if(this.open){ this.spreadOut() }
        else{ this.spreadIn() }
    }
    disconnectedCallback(){
        document.removeEventListener('click', this.listener)
    }
}
window.customElements.define('social-bar', SocialBar)