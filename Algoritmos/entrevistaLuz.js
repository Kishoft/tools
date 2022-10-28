/*
function main (alto, ancho, lights){
    let counter = 0;
    for (let x = 0; x < ancho; x++) {
        let intCounter = 0;
        let line = `X -> ${x} | Y ->`
        for (let y = 0; y < alto; y++) {
            line += ` ${y}`
            lights.forEach(light => {
                if(light[1] <= y <= light[2]){
                    intCounter++
                }
            })
        }
        if(intCounter === ancho) counter++;
        console.log(line)
    }
    console.log(counter)
}
*/
/*
function main(anchoTotal, cantidadDeLuces, lights){
    let zonasNoIluminadas = new Set();
    for (let i = 0; i <= anchoTotal; i++) {
        zonasNoIluminadas.add(i)   
    }
    for (const light of lights) {
        for (let i = light[1]; i <= light[2]; i++) {
            console.log(i)
            zonasNoIluminadas.delete(i)        
        }
        console.log("\n")
    }
    console.log(zonasNoIluminadas)
}
*/

function main(anchoTotal, cantidadDeLuces, lights) {
    let result = []
    for (let x = 0; x < cantidadDeLuces; x++) {
        let arr = []
        for (let y = 0; y < anchoTotal; y++) {
            if((lights[x][1] <= y) && (y <= lights[x][2])){
                arr.push(lights[x][0])
            }
            else arr.push(0)
        }
        result.push(arr)
    }
    console.log(result)
}
//Como se puede observar, con más lógica es posible determinar en qué columna no hay un led, cuántas, también calcular la desviación, etc ...
// las utilidades pueden ser muchas

main(5, 3, [
    [1, 1, 3],
    [2, 2, 4],
    [3, 3, 5]
])

//Ancho total
//Cantidad de luces

//color
//left
//right


