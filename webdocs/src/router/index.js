import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/api',
    name: 'API',
    component: () => import('../views/api/Index.vue'),
    children: [
      { path: 'barcode-reader', name: 'Barcode Reader', component: () => import('../views/api/BarcodeReader.vue') },
      { path: 'clip-board', name: 'Clip Board', component: () => import('../views/api/ClipBoard.vue') },
      { path: 'fetch', name: 'Fetch', component: () => import('../views/api/Fetch.vue') },
      { path: 'geo-location', name: 'Geo Location', component: () => import('../views/api/GeoLocation.vue') },
      { path: 'media-devices', name: 'Media Devices', component: () => import('../views/api/MediaDevices.vue') },
      { path: 'notification', name: 'Notification', component: () => import('../views/api/Notification.vue') },
      { path: 'permission', name: 'Permission', component: () => import('../views/api/Permission.vue') },
      { path: 'sensor', name: 'Sensor', component: () => import('../views/api/Sensor.vue') },
      { path: 'vibration', name: 'Vibration', component: () => import('../views/api/Vibration.vue') },
      { path: 'web-workers', name: 'Web Workers', component: () => import('../views/api/WebWorkers.vue') }
    ]
  },
  {
    path: '/elements',
    name: 'Elements',
    component: () => import('../views/elements/Index.vue'),
    children: [
      { path: 'custom-elements', name: 'Custom Elements', component: () => import('../views/elements/CustomElements.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
