class SocialBar extends HTMLElement{
    get open(){ return this.hasAttribute('open') }
    set open(val){
        if(val){ this.setAttribute('open','') }
        else { this.removeAttribute('open') }
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
                <a id="toggle-button">AB</a>
            </div>
            <style>
                :host > div{
                    filter: url(#goo);
                    position: relative;
                    width: 400px;
                    height: 400px;
                }
                #toggle-button, ::slotted(a){
                    position:absolute;
                    text-decoration: none;
                    width: 80px;
                    height: 80px;
                    line-height: 80px;
                    left: 50%;
                    top: 50%;
                    text-align: center;
                    border-radius: 100%;
                    font-size: 40px;
                }
                #toggle-button{
                    background-color: #f1f1f1;
                }
                ::slotted(a){
                    transition: all .5s ease;
                    background: #e97b7a;
                }
                ::slotted(a:hover){
                    background: #f1f1f1;
                }
            </style>
        `
    }
    toggleOpen(){
        if(this.open){ this.open = false; this.contraerEnGringo() } 
        else{ this.open = true; this.spread() }
    }
    toggleIfOutside(e){
        if(this.open){
            if(e.target == this || this.contains(e.target)){
                return 0;
            }
            else{ this.toggleOpen() }
        }
    }
    spread(){
        for (let index = 0; index < this.menuItems.length; index++) {
            let angulo = ((Math.PI - this.openingAngle) / 2) + ((this.openingAngle / (this.menuItems.length - 1)) * index)
            let coseno = Math.cos(angulo) * this.openDistance;
            let seno = Math.sin(angulo) * this.openDistance
            console.log(`Angulo expresado en PI: ${angulo} \n Coseno: ${coseno} \n Seno: ${seno}`);
            this.menuItems[index].style['transitionDelay'] = `${index/3}s`
            this.menuItems[index].style['transform'] = `translate(${coseno}px, ${seno}px)`
        }
    }
    contraerEnGringo(){
        for (let index = 0; index < this.menuItems.length; index++) {
            this.menuItems[index].style['transform'] = `translate(0px, 0px)`
        }
    }
    connectedCallback(){
        this.menuItems = this.getElementsByTagName('a');
        this.openingAngle = Math.PI - 0.2;
        this.openDistance = ((24 * this.menuItems.length ) - this.openingAngle) ;
        this.shadowRoot.getElementById('toggle-button').addEventListener('click', () => this.toggleOpen());
        document.addEventListener('click', this.listener = (e)=> this.toggleIfOutside(e))
    }
    disconnectedCallback(){
        document.removeEventListener('click', this.listener)
    }
}
window.customElements.define('social-bar', SocialBar)