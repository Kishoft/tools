let btnLeft = document.getElementById("btnLeft")
let btnRight = document.getElementById("btnRight")

let slider = document.getElementById("slider")



console.log(slider.getBoundingClientRect().width)

let contador = 1
/*
setInterval(() => {
    if(contador >= slider.children.length){
        contador = 1
    }
    else{

        contador++
    }
    console.log(contador)
    
    slider.children[contador - 1].scrollIntoView()
},3000)
*/
function aLaDerecha(){
    console.log(`Contador antes ${contador}`)
    comprobarIndice()
    contador++
    slider.children[contador - 1].scrollIntoView()

    console.log(`Contador después ${contador}`)
}
function aLaIzquierda(){
    console.log(`Contador antes ${contador}`)
    
    contador--
    comprobarIndice()
    slider.children[contador - 1].scrollIntoView()
    console.log(`Contador después ${contador}`)
}

function comprobarIndice(){
    if(
        (contador >= slider.children.length)
    ){
        contador = 1
    }
}


btnLeft.addEventListener("click",e => {
    console.log("Izquierda")
    aLaIzquierda()
})
btnRight.addEventListener("click",e => {
    console.log("Derecha")
    aLaDerecha()
})