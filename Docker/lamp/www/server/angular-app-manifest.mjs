
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/saraza/saraza.component.ts": [
    {
      "path": "chunk-S2UYQ4GM.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 539, hash: '845618cc03df844154de715fbd79b1a2d4a5df8105ce7e65b0caf58a48e23e14', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1052, hash: '4d503f2eaeb3f576ff720866c527fe2615bb9ca42697867db796558f944083d6', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
