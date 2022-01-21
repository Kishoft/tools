let plazasPorTransporte = 10;
let reservas = [
    {
        nombre: "Tincho",
        cupos: 4
    },
    {
        nombre: "Juan",
        cupos: 3
    },
    {
        nombre: "Pedro",
        cupos: 2
    },
    {
        nombre: "Noelia",
        cupos: 1
    },
    {
        nombre: "Arthas",
        cupos: 6
    },
    {
        nombre: "Sergio",
        cupos: 8
    },
    {
        nombre: "Alberto",
        cupos: 5
    },
    {
        nombre: "Carlitos",
        cupos: 7
    },
    {
        nombre: "Cristina",
        cupos: 9
    },
    {
        nombre: "Macri",
        cupos: 5
    }
]

let resultado = [];

reservas.sort((a, b) => { return (b.cupos - a.cupos) })

for (let i = 0; i < reservas.length; i++) {
    //console.log(`i, vale ${i}`);

    let espacioDelMedioDeTransporte = [];

    espacioDelMedioDeTransporte.push(reservas[i]);

    let plazasOcupadas = reservas[i].cupos

    //"LoS de la derecha"
    for (let e = i + 1 ; e < reservas.length; e++) {
        //En esta parte se van a computar TODOS los de la derecha
        //console.log(`e, vale ${e}`);
        if(
            (plazasOcupadas + reservas[e].cupos) <= plazasPorTransporte 
        ){
            //Se agrega la reserva a la lista del medio de transporte
            espacioDelMedioDeTransporte.push(reservas[e]);
            //Se suma el cupo de la reserva a la cantidad de plazas ocupadas
            plazasOcupadas += reservas[e].cupos;
            //Se elimina la reserva de la lista de reservas
            reservas.splice(e, 1);
        }
    }

    resultado.push(espacioDelMedioDeTransporte)
}

console.log(resultado)