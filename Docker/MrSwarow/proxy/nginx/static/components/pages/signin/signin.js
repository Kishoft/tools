class Signin extends HTMLElement {
    constructor(){
        super();
        const shadowRoot = this.attachShadow({ mode : 'open' });
        shadowRoot.innerHTML = `
        <form id="form">
            <label for="username">Usuario</label>
            <input type="text" name="username" id="username" required>
            <label for="password">Contraseña</label>
            <input type="password" name="password" id="password" required>
            <input type="submit" id="signin" value="Ingresar">
            <span>¿No tenes cuenta?</span><a id="create" >Crear cuenta</a>
        </form>
        <style>
        :host{
            position:absolute;
            top:0;
            width:100%;
            height:100%;
            display: grid;
            place-items:center;
            background:white;
        }
        form{
            display: grid;
            place-items:center;
        }
        </style>`;
        this.form = this.shadowRoot.getElementById('form');
        this.usernameInput = this.shadowRoot.getElementById('username');
        this.passwordInput = this.shadowRoot.getElementById('password');
        this.createBtn = this.shadowRoot.getElementById('create');
    }
    connectedCallback(){
        this.form.addEventListener('submit', this.listener = e => {

            e.preventDefault();

            Router.post('signin', { username : this.usernameInput.value, password : this.passwordInput.value })
            .then(res => {
                if(res.ok){
                    Router.entitySelector();
                    return res.json();
                }
                else { throw "Datos incorrectos" }
            })
            .then(resJSON => {
                localStorage.setItem('name', resJSON.name)
                localStorage.setItem('surname', resJSON.surname)
            })
            .then(() => this.remove())
            .catch(e => alert(e))

        });
        this.createBtn.addEventListener('click', () => Router.signup())
    }
}

window.customElements.define('signin-form', Signin)