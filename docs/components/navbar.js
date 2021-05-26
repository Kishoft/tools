class navBar extends HTMLElement {
    get barHeight() { return this.getAttribute('height') || `3.5em` }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML += `
        <style>
            :host{
                position:fixed;
                top: 0;
                display:flex;
                width: 100%;
                z-index: 1001;
            }
            #toggleButton {
                position:absolute;
                right:-35px;
                top:0;
                display:flex;
                flex-direction:column;
                justify-content:space-evenly;
                align-items:center;
                border: 1px solid var(--main-color);
                border-radius: 5px;
                height:30px;
                width: 35px;
                cursor: pointer;
            }
            #toggleButton > .bar {
                width:80%;
                height:4px;
                transition:all .5s ease;
                perspective: 10px;
                background: var(--main-color);
            }
            .bar:nth-child(1){
                transform-origin:left;
            }
            .bar:nth-child(3){
                transform-origin:left;
            }
            :host([open]) .bar:nth-child(1) {
                transform: translateX(2.5px) rotate(40deg);
            }
            :host([open]) .bar:nth-child(2) {
                transform: rotateY(90deg)
            }
            :host([open]) .bar:nth-child(3) {
                transform: translateX(2.5px) rotate(-40deg) ;
            }
            #navBarContent{
                position:fixed;
                width: 250px;
                height:100vh;
                left:-250px;
                transition:all 1s ease;
                background: var(--background-main-color);
            }
            :host([open]) #navBarContent{
                left:0;
            }
            #navBarContent > nav{
                display:flex;
                flex-direction:column;
            }
            #navBarContent a{
                text-decoration: none;
                height: 25px;
                color: var(--main-color);
            }
            #navBarContent a:hover{
                text-decoration: underline;
            }
        </style>
        <div id="navBarContent">
            <div id="toggleButton">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
            <nav>

                <a href="/pages/language/promises.html">Promises</a>
                <a href="/pages/language/dataTypes.html">Data Types</a>
                <a href="/pages/language/logicalAssigmentOperators.html">Logical Assigment Operators</a>

                <a href="/pages/api/mediaDevices.html">Media Devices</a>
                <a href="/pages/api/barcodereader.html">Barcode Reader</a>
                <a href="/pages/api/nfc.html">NFC</a>
                <a href="/pages/api/geolocation.html">Geolocation</a>
                <a href="/pages/api/permission.html">Permission</a>
                <a href="/pages/api/screenwakelock.html">Screen Wake Lock</a>
                <a href="/pages/api/screen.html">Screen</a>
                <a href="/pages/api/sensors.html">Sensors</a>
                <a href="/pages/api/vibration.html">Vibration</a>
                <a href="/pages/api/draganddrop.html">Drag and Drop</a>
                <a href="/pages/api/cache.html">Cache</a>
                <a href="/pages/api/fetch.html">Fetch</a>
                <a href="/pages/api/bluetooth.html">Bluetooth</a>
                <a href="/pages/api/file.html">File</a>
                <a href="/pages/api/storage.html">Storage</a>
                <a href="/pages/api/formdata.html">Form Data</a>
                <a href="/pages/api/history.html">History</a>
                <a href="/pages/api/broadcastchannel.html">BroadCast Channel</a>
                <a href="/pages/api/keyboard.html">Location</a>
                <a href="/pages/api/idb.html">Indexed DB</a>
                <a href="/pages/api/navigator.html">Navigator</a>
                <a href="/pages/api/notification.html">Notification</a>
                <a href="/pages/api/push.html">Push</a>
                <a href="/pages/api/performance.html">Performance</a>
                <a href="/pages/api/url.html">URL</a>
                <a href="/pages/api/webworker.html">Web Workers</a>
                <a href="/pages/api/serviceworker.html">Service Workers</a>
                <a href="/pages/api/animationworklet.html">Animation Worklet</a>
                <a href="/pages/api/paintworklet.html">Paint Worklet</a>
                <a href="/pages/api/audioworklet.html">Audio Worklet</a>
                <a href="/pages/api/offscreencanvas.html">Offscreen Canvas</a>
                <a href="/pages/api/houdini.html">The Houdini</a>
                <a href="/pages/api/sse.html">Server Side Events</a>
                <a href="/pages/api/ws.html">Web Sockets</a>
                <a href="/pages/api/reporting.html">Reporting</a>
                <a href="/pages/api/webgl.html">WebGL</a>
                <a href="/pages/api/webgpu.html">WebGPU</a>
                <a href="/pages/api/webhid.html">WebHID</a>
                <a href="/pages/api/gamepad.html">Gamepad</a>
                <a href="/pages/api/pip.html">Picture in Picture</a>
                
                <a href="/pages/events/eventemitter.html">Event Emitter (Custom Events)</a>
                <a href="/pages/events/keyboard.html">Keyboard</a>
                <a href="/pages/events/mouse.html">Mouse</a>
                <a href="/pages/events/touch.html">Touch</a>
                <a href="/pages/events/wheel.html">Wheel</a>
                <a href="/pages/events/window.html">Window</a>
                <a href="/pages/events/ui.html">UI</a>
                
                <a href="/pages/elements/customelements.html">Custom Elements</a>
                <a href="/pages/elements/anchor.html">HTML Anchor</a>
                <a href="/pages/elements/audio.html">HTML Audio</a>
                <a href="/pages/elements/canvas.html">HTML Canvas</a>
                <a href="/pages/elements/svg.html">HTML SVG</a>
                <a href="/pages/elements/mathml.html">MathML</a>
                <a href="/pages/elements/collection.html">HTML Collection</a>
                <a href="/pages/elements/div.html">HTML Div</a>
                <a href="/pages/elements/form.html">HTML Form</a>
                <a href="/pages/elements/head.html">HTML Head</a>
                <a href="/pages/elements/html.html">HTML HTML</a>
                <a href="/pages/elements/image.html">HTML Image</a>
                <a href="/pages/elements/input.html">HTML Input</a>
                <a href="/pages/elements/label.html">HTML Label</a>
                <a href="/pages/elements/media.html">HTML Media</a>
                <a href="/pages/elements/select.html">HTML Select</a>
                <a href="/pages/elements/style.html">HTML Style</a>
                <a href="/pages/elements/table.html">HTML Table</a>
                <a href="/pages/elements/video.html">HTML Video</a>

                <a href="/pages/pwa/templateHTML.html">Plantillas HTML</a>
                <a href="https://supple.com.au/tools/scroll-to-text-fragment-generator-bookmarklet/#:~:text=Scroll%20To%20Text%20Fragment%20is,snippet%20provided%20in%20the%20URL.">Scroll To Text Fragment</a>
                <a href="/pages/pwa/trustedtypes.html">Trusted Types</a>
                <a href="/pages/pwa/manifest.html">Manifest JSON</a>
                <a href="/pages/pwa/meta.html">Meta Tags</a>
                <a href="/pages/pwa/link.html">Link Tags</a>
                

                
            </nav>
        </div>
        `;
        this.toggleBtn = this.shadowRoot.getElementById('toggleButton')
    }
    toggleIfOutside(e) {

        if(
            e.path.includes(this.toggleBtn) ||
            (
                this.hasAttribute('open') &&
                !this.contains(e.target)
            )
        ){
            this.toggleAttribute('open');
        }

        /*
            if (e.target == this || this.contains(e.target)) {
                if (e.path[1].tagName == 'NAV') { this.toggleAttribute('open') }
            }
            else { this.toggleAttribute('open') }*/
    }
    connectedCallback() {
        document.addEventListener('click', this.navbarListener = (e) => this.toggleIfOutside(e));
    }
    disconnectedCallback() {
        document.removeEventListener('click', this.navbarListener)
    }
}

window.customElements.define('nav-bar', navBar)