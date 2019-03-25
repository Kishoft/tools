class Container3d extends HTMLElement{

    constructor(){
        super();
        this.X
        this.Y
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML += `
            <div id="cube3d">
                <div id="layer1">
                    <slot name="layer-1"></slot>
                </div>
                <div id="layer2">
                    <slot name="layer-2"></slot>
                </div>
            </div>
            <style>
                :host{
                    display: inline-flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    position: relative;
                    margin: 20px;
                    perspective: 300px;
                    will-change: transform;
                    position:relative;
                }
                #cube3d{
                    height: 250px;
                    width: 250px;
                    transform-style: preserve-3d;
                    backface-visibility: hidden;
                    transition: all .2s linear;
                    border-radius: 20px;
                    will-change: transform;
                    padding:10px;
                    background-color: blue;
                    border: 1px solid rgba(96, 5, 255,.60);
                    z-index: 1001;
                }
                #cube3d::before{
                    content:'';
                    width:100%;
                    height:100%;
                    position:absolute;
                    top:0;
                    left:0;
                    background-color: rgba(96, 5, 255);
                    border-radius: 20px;
                    will-change: transform filter;
                    filter: blur(15px);
                    opacity: .4;
                    transform: translateZ(-40px) scale(1.2);
                    transition: all .3s linear
                }
                #cube3d:hover::before{
                    opacity:.7
                }
                #layer1, #layer2{
                    transition: all .2s linear
                }
                #cube3d:hover #layer1{
                    transform: translateZ(20px);
                }
                #cube3d:hover #layer1{
                    transform: translateZ(10px);
                }
            </style>
        `;
        this.cube = this.shadowRoot.getElementById('cube3d');
    }
    movement(event){
        requestAnimationFrame(()=>{
            this.X = (Math.round(((this.clientWidth / 2) - (event.pageX - this.getBoundingClientRect().left)) / (this.clientWidth / 2) * -50) / 100);
            this.Y = (Math.round(((this.clientHeight / 2) - (event.pageY - this.getBoundingClientRect().top)) / (this.clientHeight / 2) * 50) / 100);
    
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

window.customElements.define('container-3d', Container3d)