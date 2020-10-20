class Slider extends HTMLElement{
    constructor(){
        super()
        this.elWidth = "100vw"
        this.css = `
        <style>
            :host{
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                background-color: aliceblue;
                width: ${this.elWidth};
            }
            #container{
                width: ${this.elWidth};
                height:400px;
                position: relative;
                display:flex;
                justify-content:flex-start;
                align-items:center;
                overflow:hidden;
                scroll-behavior: smooth;
            }
            ::slotted(slider-item){
                flex-shrink: 0;
                position:relative;
                background-color: antiquewhite;
                width: ${this.elWidth};
                height: 100%;
            }
            #controls{
                display:flex;
                justify-content:space-evenly;
                min-width: 200px;
            }
            #controls > div{
                cursor:pointer;
                display:flex;
                justify-content:center;
                align-items:center;
                border-radius: 50px;
                width: 50px;
                height: 50px;
                background-color : orangered;
            }
            #indicators{
                display:flex;
                justify-content:space-evenly;
                transform: translateY(-100px);
            }
            .indicator{
                width: 15px;
                height: 15px;
                border-radius: 15px;
                margin:5px;
                background-color: aliceblue;
            }

        </style>
        `
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML += this.css

        this.counter = 0;

        this.content = document.createElement("slot")

        this.container = document.createElement("div")
        this.container.id = "container"

        this.controls = document.createElement("div")
        this.controls.id = "controls"

        this.leftButton = document.createElement("div")
        this.leftButton.textContent = "<"

        this.rightButton = document.createElement("div")
        this.rightButton.textContent = ">"

        this.container.appendChild(this.content)
        this.controls.appendChild(this.leftButton)
        this.controls.appendChild(this.rightButton)
        
        
        this.shadowRoot.appendChild(this.container)
        this.shadowRoot.appendChild(this.controls)


    }

    scrollTo(position){
        this.content.assignedElements()[position].scrollIntoView()
        console.log(`yendo a la posición ${position}`)
    }
    toLeft(){
        this.counter--
        if(this.counter < 0) this.counter = this.content.assignedElements().length - 1
        this.scrollTo(this.counter)
    }
    toRight(){
        this.counter++
        if(this.counter > this.content.assignedElements().length - 1 ) this.counter = 0
        this.scrollTo(this.counter)
    }
    connectedCallback(){
        this.leftButton.addEventListener("click", e => this.toLeft())
        this.rightButton.addEventListener("click", e => this.toRight())
    }
}
class SliderItem extends HTMLElement{
    constructor(){
        super();
        this.css = `
        <style>
            :host{
                position:relative;
                height:100%;
                width:100%;
            }
            ::slotted(img){
                height: 100%;
                width: 100%;
                object-fit: cover;
            }
        </style>
        `
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML += this.css;

        this.content = document.createElement("slot")

        this.shadowRoot.appendChild(this.content)
    }
}


customElements.define("custom-slider", Slider)
customElements.define("slider-item", SliderItem)