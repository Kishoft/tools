class Loader extends HTMLElement {
    constructor(){
        super();
        document.body.style.overflowY = 'hidden';
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML =`
    <span id="text">WAVENET</span>
    <div id="points">
        <div class="point" style="--i:0"></div>
        <div class="point" style="--i:1"></div>
        <div class="point" style="--i:2"></div>
        <div class="point" style="--i:3"></div>
        <div class="point" style="--i:4"></div>
        <div class="point" style="--i:5"></div>
        <div class="point" style="--i:6"></div>
        <div class="point" style="--i:7"></div>
        <div class="point" style="--i:8"></div>
        <div class="point" style="--i:9"></div>
    </div>
        <style>
            :host{
                position:fixed;
                top:0;
                left:0;
                width:100%;
                height:100vh;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                background: #141f22;
                z-index: 8888;
                opacity: 1;
            }
            img{filter : drop-shadow(0 0 5px white)}
            #text{
                display:flex;
                padding:40px;
                position:relative;
                font-size: 70px;
                color:white;
                letter-spacing: 5px;
                overflow:hidden;
                margin-bottom: 5vh;
                animation: typing 8s steps(11) infinite;
                text-shadow: 0px 0px 50px white;
            }            
            #points{
                display:inline-flex;
                justify-content:space-evenly;
                width:80%;
            }
            .point{
                position:relative;
                width:10px;
                height:10px;
                border-radius: 50%;
                background: white;
                animation: point 2s linear infinite;
                animation-delay : calc(0.1s * var(--i))
            }
            .point::after{
                position:absolute;
                top:0;
                left:0;
                content:'';
                width:10px;
                height:10px;
                background: white;
                filter : blur(20px);
                z-index:-1
            }
            @keyframes point{
                0%, 50%, 100%{transform:scale(1)}
                10%{transform:scale(4)}
            }
            @keyframes hide{
                from{ opacity: 1 }
                to{ opacity:0 }
            }
        </style>
        `
    }
    connectedCallback(){
        window.addEventListener('load', () => { 
            document.body.style.overflowY = `auto`;
            this.style.animation = "hide 1s linear forwards";
            this.remove()
        })
    }
}
window.customElements.define('page-loader', Loader)