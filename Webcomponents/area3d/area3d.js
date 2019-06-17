class Area3d extends HTMLElement{

    constructor(){
        super();
        this.X
        this.Y
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML += `
            <div>
                <slot></slot>
            </div>
            <style>
                :host{
                    perspective: 400px;
                    will-change: transform;
                }
                :host > div{
                    width:100%;
                    height:100%;
                    transform-style: preserve-3d;
                    backface-visibility: hidden;
                    will-change: transform;
                    transition: all .2s ease;
                    border-radius: 25px;
                }
                :host > div:hover {
                    box-shadow: 0 0 15px 1px rgba(0,0,0, .4);
                }
            </style>
        `;
        this.cube = this.shadowRoot.firstElementChild
    }
    movement(event){
        requestAnimationFrame(()=>{
            this.X = (Math.round(((this.clientWidth / 2) - (event.pageX - this.offsetLeft - this.offsetParent.offsetLeft)) / (this.clientWidth / 2) * -50) / 100);
            this.Y = (Math.round(((this.clientHeight / 2) - (event.pageY - this.offsetTop - this.offsetParent.offsetTop)) / (this.clientHeight / 2) * 50) / 100);
            this.cube.style['transform'] = `rotateX(${this.Y * 8}deg) rotateY(${(this.X * 8)}deg) translateZ(10px)`;
        })
    }
    //turnOnContainer(){ requestAnimationFrame( ()=>{ this.cube.style['box-shadow'] = '0 0 15px 1px rgba(0,0,0, .4)' } )}
    turnOffContainer(){ requestAnimationFrame(()=>{ this.cube.style['transform'] = 'rotateX(0) rotateY(0) translateZ(0)' }) }

    connectedCallback(){
        if (window.matchMedia("(min-width: 650px)").matches) {
            //this.addEventListener('mouseenter', () => { this.turnOnContainer() })
            this.addEventListener('mousemove', (event) => this.movement(event));
            this.addEventListener('mouseleave', () => this.turnOffContainer())
        }
    }
}

window.customElements.define('area-3d', Object.freeze(Area3d))