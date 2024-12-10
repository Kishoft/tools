function toBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.addEventListener('load', e => {
            let dataURL = reader.result;
            resolve(dataURL)
        });

        reader.readAsDataURL(blob)
    })
}

function urlToBase64(url){
    return fetch(url)
    .then(img => img.blob())
    .then(blob => toBase64(blob))
}
/*
(async function(){
    let res1 = await urlToBase64('logo-512.png')
    let res2 = await urlToBase64('logo-192.png')
    let res3 = await urlToBase64('logo-192.png')

    console.log(res1,res2)
    console.log(res2 === res3)

})()
*/


fetch('/logo-512.png')
    .then(img => img.blob())
    .then(blob => {

        blob.stream().getReader().read().then(r => console.log(r))

        toBase64(blob).then(r => console.log(r))

        let url = URL.createObjectURL(blob)

        console.log(url)
        return url
    })
    .then(img => {
        let imagen = document.createElement('img')
        imagen.src = img;
        document.body.append(imagen)
    })

