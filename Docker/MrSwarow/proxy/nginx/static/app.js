if(!localStorage.hasOwnProperty('user') && !localStorage.hasOwnProperty('surname')) { Router.signin() } 
else if(!localStorage.hasOwnProperty('entity')) { Router.entitySelector() }


document.getElementById('switch').addEventListener('click', () => Router.entitySelector())
document.getElementById('products').addEventListener('click', () => Router.products())
document.getElementById('sales').addEventListener('click', () => Router.sales())
document.getElementById('clients').addEventListener('click', () => Router.clients())
document.getElementById('payment_methods').addEventListener('click', () => Router.payment_methods())
document.getElementById('signout').addEventListener('click', () => Router.signout())


window.addEventListener('load', () => {

    Notification.requestPermission(function (result) {
        result === 'denied' ? console.log('Permission wasn\'t granted. Allow a retry.') :
        result === 'default' ? console.log('The permission request was dismissed.') : null
    })

    if ('caches' in window && 'serviceWorker' in navigator) {

        navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log(`Se registró el Worker de Caché con el scope ${registration.scope}`)
            document.getElementById('updateP').addEventListener('click', e => {
                navigator.serviceWorker.ready.then(r => { 
                    r.sync.register('updateProducts')
                    r.sync.register('updateSales')
                    r.sync.register('updateClients')
                    r.sync.register('updatePaymentMethods')
                })
                console.log('Actualizacion solicitada')
            })
            navigator.serviceWorker.ready.then(r => r.active.postMessage('tabOpened'))
        })
        .catch(e => console.log(e))
    }
})

let worker = new Worker('./worker.js');