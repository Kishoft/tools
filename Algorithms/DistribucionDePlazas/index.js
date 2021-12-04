//Se requiere establecer plazas-colectivos de larga distancia y ordenar las plazas en los colectivos tal que el espacio sea óptimo
let cuposSolicitados = [
    { nombre : "Tincho", plazas : 3},
    { nombre : "Pepe", plazas : 4},
    { nombre : "Carlitos", plazas : 1},
    { nombre : "Sultano", plazas : 6},
    { nombre : "Mengano", plazas : 5},
    { nombre : "Fulano", plazas : 8},
    { nombre : "Arthas", plazas : 3},
    { nombre : "Jaimito", plazas : 8},
    { nombre : "Argento", plazas : 2 }
]
let cupoPorColectivo = 10;
let resultado = [];

//Ordenamos de mayor a menor

cuposSolicitados.sort((a, b) => {
    return b.plazas - a.plazas
})

console.log(cuposSolicitados)

for (let i = 0; i < cuposSolicitados.length; i++) {
    let acumulador = []
    acumulador.push(cuposSolicitados[i])
    let acumuladorPlazasTotal = cuposSolicitados[i].plazas
    for (let e = i + 1; e < cuposSolicitados.length; e++) {
        if( (acumuladorPlazasTotal + cuposSolicitados[e].plazas) <= cupoPorColectivo){
            acumulador.push(cuposSolicitados[e])
            acumuladorPlazasTotal += cuposSolicitados[e].plazas
            cuposSolicitados.splice(e, 1);
        }
    }
    resultado.push(acumulador)
}
console.log(resultado)