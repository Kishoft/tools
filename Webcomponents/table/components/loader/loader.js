import styles from './loader.css' assert { type: 'css'};

class LoaderComponent extends HTMLElement {

    static get observedAttributes() {
        return ["loading"];
    }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    render() {
        return `
            <img src="./components/loader/loader.gif" alt="">
        `
    }

    attributeChangedCallback(attrName, oldVal, newVal) { 
        if (attrName === "loading") {
            if (newVal === null) {
              this.style.display = "none";
            }
            else {
                this.style.display = "flex";
            }
        }
    }
    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [styles];
        this.shadowRoot.innerHTML = this.render()
    }
    disconnectedCallback() { }
    //adoptedCallback(){}

}

customElements.define("loader-component", LoaderComponent);