class NetStatus extends HTMLElement {
    constructor(){
        super();
        const shadowRoot = this.attachShadow({ mode : 'open' });
        shadowRoot.innerHTML += 
        `
        <style>
        :host{
            display:flex;
            width: 15px;
            height: 15px;
            border-radius: 50%;
        }
        </style>
        `
    }
    isOnline(){
        if (navigator.onLine){
          console.log('Online')
          this.style.backgroundColor = "rgb(134, 206, 52)"
        } else {
          console.log('Offline')
          this.style.backgroundColor = "rgb(206, 70, 52)"
        }
    }
    connectedCallback(){
        console.log(this)
        this.isOnline()
        window.addEventListener('online', e => this.isOnline())
        window.addEventListener('offline', e => this.isOnline())
    }
}

window.customElements.define('net-status', NetStatus)