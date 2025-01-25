class Nombre extends HTMLElement {
    //observable
    static get observedAttributes() {
        return ['disabled', 'open'];
      }
    constructor(){
        super();
        const shadowRoot = this.attachShadow({ mode : 'open' });
        shadowRoot.innerHTML += ``
    }
    //Se llama cada vez que se inserta el elemento en el DOM. Es útil para ejecutar código de configuración, 
    //como la obtención de recursos o la representación. En general, debes intentar demorar el trabajo hasta este momento.
    connectedCallback(){}
    //Se llama cada vez que se quita el elemento del DOM. Es útil para ejecutar código de limpieza (eliminación de receptores de eventos, etc.).
    disconnectedCallback(){}
    //Se agrega, quita, actualiza o reemplaza un atributo. También se llama para obtener valores iniciales cuando el analizador 
    //crea un elemento o lo actualiza. Nota: solo los atributos que se indiquen en la propiedad observedAttributes recibirán este callback.
    attributeChangedCallback(attrName, oldVal, newVal){}
    //El elemento personalizado se traslada a un nuevo document (p. ej., alguien llama a document.adoptNode(el)).
    adoptedCallback(){}
}