class RouterLink extends HTMLAnchorElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', e => {
      e.preventDefault();

      this.dispatchEvent(new CustomEvent('route-change', {
        composed: true,
        bubbles: true,
        detail: {link: this}
      }));
    })
  }
}

class ClientSideRouter extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: space-between;
          width: 150px;
          padding: 5px;
          background-color: #cccccc;
        }
        ::slotted(a) {
          display: block;
          color: #000000;
          text-decoration: none;
          padding: 5px;
        }
      </style>
      <slot name="link"></slot>
    `;
  }

  connectedCallback() {
    this.outlet = document.querySelector(this.dataset.outlet);

    this.addEventListener('route-change', e => {
      this.handleRouteChange(e.detail.link)
    });
  }

  async handleRouteChange(link) {
    const template = link.dataset.template;
    const url = link.getAttribute('href');
    const state = {template, url};

    const html = await (await fetch(template)).text();

    history.pushState(state, null, url);

    this.outlet.innerHTML = html;
  }
}

customElements.define('client-side-router', ClientSideRouter, {extends: 'nav'});
customElements.define('router-link', RouterLink, {extends: 'a'});