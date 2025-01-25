class Signup extends HTMLElement {
    constructor(){
        super();
        const shadowRoot = this.attachShadow({ mode : 'open' });
        shadowRoot.innerHTML = `
        <form id="form">
            <label for="username">Usuario</label>
            <input type="text" name="username" id="username" required>
            <label for="password">Contraseña</label>
            <input type="password" name="password" id="password" required>
            <label for="dni">Documento de Identidad</label>
            <input type="text" name="dni" id="dni" required>
            <input type="submit" id="signup" value="Crear cuenta">
            <input type="button" id="exit" value="Salir">
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
        </style>
        `;
        this.form = this.shadowRoot.getElementById('form')
        this.usernameInput = this.shadowRoot.getElementById('username');
        this.passwordInput = this.shadowRoot.getElementById('password');
        this.dniInput = this.shadowRoot.getElementById('dni');
        this.exitBtn = this.shadowRoot.getElementById('exit');
    }
    connectedCallback(){
        this.form.addEventListener('submit', this.listener = e =>{
            e.preventDefault()
            Router.post('signup', { username : this.usernameInput.value, password : this.passwordInput.value, dni : this.dniInput.value })
            .then(res => {
                if(res.ok){
                    alert('La cuenta ha sido creada');
                    this.remove()
                }
                else if(res.status === 400){ alert('La cuenta ya existe') }
                else if(res.status === 500){ alert('Error interno del servidor, si no funciona prueba más tarde') }
                else{ alert('Explotó algo nuevo, oh rayos'); console.log(res.status) }
            })
        })
        this.exitBtn.addEventListener('click', ()=> this.remove() )
    }
}

window.customElements.define('signup-form', Signup)