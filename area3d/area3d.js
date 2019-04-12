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
                    position: relative;
                    perspective: 400px;
                    will-change: transform;
                }
                :host > div{
                    width:100%;
                    height:100%;
                    position:absolute;
                    transform-style: preserve-3d;
                    backface-visibility: hidden;
                    transition: all .2s linear;
                    will-change: transform;
                }
            </style>
        `;
        this.cube = this.shadowRoot.firstElementChild
        console.log(this.shadowRoot.styleSheets)
    }
    movement(event){
        requestAnimationFrame(()=>{
            this.X = (Math.round(((this.clientWidth / 2) - (event.pageX - this.offsetLeft - this.offsetParent.offsetLeft)) / (this.clientWidth / 2) * -50) / 100);
            this.Y = (Math.round(((this.clientHeight / 2) - (event.pageY - this.offsetTop - this.offsetParent.offsetTop)) / (this.clientHeight / 2) * 50) / 100);
            this.cube.style['transform'] = `rotateX(${this.Y * 8}deg) rotateY(${(this.X * 8)}deg) translateZ(10px)`;
        })
    }
    turnOffContainer(){
        requestAnimationFrame(()=>{
            this.cube.style['transform'] = '';
        })
    }

    connectedCallback(){
        this.addEventListener('mousemove', (event) => this.movement(event));
        this.addEventListener('mouseleave', () => this.turnOffContainer())
    }
}

window.customElements.define('area-3d', Object.freeze(Area3d))