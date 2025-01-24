let container = document.getElementById("container")

let burbujas = 250;

for (let i = 0; i < burbujas; i++) {
    let burbuja = document.createElement("div")
    burbuja.style.animationDelay = `${Math.random() * 10}s`
    burbuja.style.animationDuration = `${Math.floor(Math.random() * (8 - 4) ) + 4}s`
    burbuja.style.left = `${Math.random() * window.innerWidth}px`
    burbuja.classList.add("burbuja")
    container.append(burbuja)
}