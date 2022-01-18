import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/api',
    name: 'API',
    component: () => import('../views/api/Index.vue'),
    children: [
      { path: 'intl', name: 'Intl', component: () => import('../views/api/Intl.vue') },
      { path: 'fetch', name: 'Fetch', component: () => import('../views/api/Fetch.vue') },
      { path: 'push', name: 'Push', component: () => import('../views/api/Push.vue') },
      { path: 'server-side-events', name: 'Server Side Events', component: () => import('../views/api/ServerSideEvents.vue') },
      { path: 'web-sockets', name: 'Web Sockets', component: () => import('../views/api/WebSockets.vue') },
      { path: 'web-transport', name: 'Web Transport', component: () => import('../views/api/WebTransport.vue') },
      { path: 'formdata', name: 'FormData', component: () => import('../views/api/FormData.vue') },
      { path: 'url', name: 'URL', component: () => import('../views/api/URL.vue') },
      { path: 'cache', name: 'Cache', component: () => import('../views/api/Cache.vue') },
      { path: 'permission', name: 'Permission', component: () => import('../views/api/Permission.vue') },
      { path: 'media-devices', name: 'Media Devices', component: () => import('../views/api/MediaDevices.vue') },
      { path: 'bluetooth', name: 'Bluetooth', component: () => import('../views/api/Bluetooth.vue') },
      { path: 'sensor', name: 'Sensor', component: () => import('../views/api/Sensor.vue') },
      { path: 'vibration', name: 'Vibration', component: () => import('../views/api/Vibration.vue') },
      { path: 'barcode-reader', name: 'Barcode Reader', component: () => import('../views/api/BarcodeReader.vue') },
      { path: 'geo-location', name: 'Geo Location', component: () => import('../views/api/GeoLocation.vue') },
      { path: 'notification', name: 'Notification', component: () => import('../views/api/Notification.vue') },
      { path: 'badging', name: 'Badging', component: () => import('../views/api/Badging.vue') },
      { path: 'media-session', name: 'Media Session', component: () => import('../views/api/MediaSession.vue') },
      { path: 'keyboard', name: 'Keyboard', component: () => import('../views/api/Keyboard.vue') },
      { path: 'nfc', name: 'NFC', component: () => import('../views/api/NFC.vue') },
      { path: 'eye-dropper', name: 'Eye Dropper', component: () => import('../views/api/EyeDropper.vue') },
      { path: 'screen-wake-lock', name: 'Screen Wake Lock', component: () => import('../views/api/ScreenWakeLock.vue') },
      { path: 'screen', name: 'Screen', component: () => import('../views/api/Screen.vue') },
      { path: 'full-screen', name: 'Full Screen', component: () => import('../views/api/FullScreen.vue') },
      { path: 'multi-screen-placement', name: 'Multi Screen Placement', component: () => import('../views/api/MultiScreenPlacement.vue') },
      { path: 'intersection-observer', name: 'Intersection Observer', component: () => import('../views/api/IntersectionObserver.vue') },
      { path: 'pointer-lock', name: 'Pointer Lock', component: () => import('../views/api/PointerLock.vue') },
      { path: 'picture-in-picture', name: 'Picture In Picture', component: () => import('../views/api/PictureInPicture.vue') },
      { path: 'off-screen-canvas', name: 'Off Screen Canvas', component: () => import('../views/api/OffScreenCanvas.vue') },
      { path: 'clip-board', name: 'Clip Board', component: () => import('../views/api/ClipBoard.vue') },
      { path: 'web-share', name: 'Web Share', component: () => import('../views/api/WebShare.vue') },
      { path: 'drag-and-drop', name: 'Drag and Drop', component: () => import('../views/api/DragAndDrop.vue') },
      { path: 'file', name: 'File', component: () => import('../views/api/File.vue') },
      { path: 'file-system-access', name: 'File System Access', component: () => import('../views/api/FileSystemAccess.vue') },
      { path: 'storage', name: 'Storage', component: () => import('../views/api/Storage.vue') },
      { path: 'indexeddb', name: 'Indexed DB', component: () => import('../views/api/IndexedDB.vue') },
      { path: 'history', name: 'History', component: () => import('../views/api/History.vue') },
      { path: 'navigator', name: 'Navigator', component: () => import('../views/api/Navigator.vue') },
      { path: 'notifications', name: 'Notifications', component: () => import('../views/api/Notifications.vue') },
      { path: 'performance', name: 'Performance', component: () => import('../views/api/Performance.vue') },
      { path: 'broadcast-channel', name: 'Broadcast Channel', component: () => import('../views/api/BroadcastChannel.vue') },
      { path: 'web-workers', name: 'Web Workers', component: () => import('../views/api/WebWorkers.vue') },
      { path: 'service-workers', name: 'Service Workers', component: () => import('../views/api/ServiceWorkers.vue') },
      { path: 'animation-worklets', name: 'Animation Worklets', component: () => import('../views/api/AnimationWorklets.vue') },
      { path: 'paint-worklets', name: 'Paint Worklets', component: () => import('../views/api/PaintWorklets.vue') },
      { path: 'audio-worklets', name: 'Audio Worklets', component: () => import('../views/api/AudioWorklets.vue') },
      { path: 'houdini-css', name: 'Houdini CSS', component: () => import('../views/api/HoudiniCSS.vue') },
      { path: 'reporting', name: 'Reporting', component: () => import('../views/api/Reporting.vue') },
      { path: 'web-gl', name: 'Web GL', component: () => import('../views/api/WebGL.vue') },
      { path: 'web-gpu', name: 'Web GPU', component: () => import('../views/api/WebGPU.vue') },
      { path: 'web-hid', name: 'Web HID', component: () => import('../views/api/WebHID.vue') },
      { path: 'web-authn', name: 'Web Authn', component: () => import('../views/api/WebAuthn.vue') },
      { path: 'web-serial', name: 'Web Serial', component: () => import('../views/api/WebSerial.vue') },
      { path: 'game-pad', name: 'Game Pad', component: () => import('../views/api/GamePad.vue') },
      { path: 'web-xr', name: 'Web XR', component: () => import('../views/api/WebXR.vue') },
      { path: 'web-speech', name: 'Web Speech', component: () => import('../views/api/WebSpeech.vue') },
      { path: 'web-animations', name: 'Web Animations', component: () => import('../views/api/WebAnimations.vue') },
      { path: 'content-indexing', name: 'Content Indexing', component: () => import('../views/api/ContentIndexing.vue') },
      { path: 'digital-goods', name: 'Digital Goods', component: () => import('../views/api/DigitalGoods.vue') },
      { path: 'payment-handler', name: 'Payment Handler', component: () => import('../views/api/PaymentHandler.vue') }
    ]
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../views/events/Index.vue'),
    children: [
      { path: 'event-emitter', name: 'Event Emitter', component: () => import('../views/events/EventEmitter.vue') },
      { path: 'keyboard', name: 'Keyboard', component: () => import('../views/events/Keyboard.vue') },
      { path: 'mouse', name: 'Mouse', component: () => import('../views/events/Mouse.vue') },
      { path: 'touch', name: 'Touch', component: () => import('../views/events/Touch.vue') },
      { path: 'wheel', name: 'Wheel', component: () => import('../views/events/Wheel.vue') },
      { path: 'pointer', name: 'Pointer', component: () => import('../views/events/Pointer.vue') },
      { path: 'window', name: 'Window', component: () => import('../views/events/Window.vue') },
      { path: 'ui', name: 'UI', component: () => import('../views/events/UI.vue') },
      { path: 'media', name: 'Media', component: () => import('../views/events/Media.vue') }
    ]
  },
  {
    path: '/web',
    name: 'WEB',
    component: () => import('../views/web/Index.vue'),
    children: [
      { path: 'pwa', name: 'PWA', component: () => import('../views/web/PWA.vue') },
      { path: 'manifest', name: 'Manifest', component: () => import('../views/web/Manifest.vue') },
      { path: 'trusted-types', name: 'Trusted Types', component: () => import('../views/web/TrustedTypes.vue') },
      { path: 'meta', name: 'Meta', component: () => import('../views/web/Meta.vue') },
      { path: 'link', name: 'Link', component: () => import('../views/web/Link.vue') },
      { path: 'script', name: 'Script', component: () => import('../views/web/Script.vue') },
      { path: 'modules', name: 'Modules', component: () => import('../views/web/Modules.vue') },
      { path: 'scroll-to-text-fragment', name: 'Scroll To Text Fragment', component: () => import('../views/web/ScrollToTextFragment.vue') },
      { path: 'custom-elements', name: 'Custom Elements', component: () => import('../views/web/CustomElements.vue') },
      { path: 'url-pattern', name: 'URL Pattern', component: () => import('../views/web/URLPattern.vue') },
      { path: 'protocol-handler', name: 'Protocol Handler', component: () => import('../views/web/ProtocolHandler.vue') },
      { path: 'priority-hints', name: 'Priority Hints', component: () => import('../views/web/PriorityHints.vue') },
      { path: 'preload', name: 'Preload', component: () => import('../views/web/Preload.vue') },
      { path: 'shadow-dom', name: 'Shadow DOM', component: () => import('../views/web/ShadowDOM.vue') }
    ]
  },
  {
    path: '/javascript',
    name: 'JavaScript',
    component: () => import('../views/javascript/Index.vue'),
    children: [
      { path: 'streams', name: 'Streams', component: () => import('../views/javascript/Streams.vue') },
      { path: 'promises', name: 'Promises', component: () => import('../views/javascript/Promises.vue') },
      { path: 'generators', name: 'Generators', component: () => import('../views/javascript/Generators.vue') },
      { path: 'data-types', name: 'Data Types', component: () => import('../views/javascript/DataTypes.vue') },
      { path: 'logical-assigment-operators', name: 'Logical Assigment Operators', component: () => import('../views/javascript/LogicalAssigmentOperators.vue') }
    ]
  },
  {
    path: '/web-assembly',
    name: 'Web Assembly',
    component: () => import('../views/wasm/Index.vue'),
    children: []
  },
  {
    path: '/protocols',
    name: 'Protocols',
    component: () => import('../views/protocols/Index.vue'),
    children: [
      { path: 'http', name: 'HTTP', component: () => import('../views/protocols/HTTP.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
