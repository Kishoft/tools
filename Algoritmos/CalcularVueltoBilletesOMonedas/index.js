let montoARetirar = 13675;
let billetesVigentes = [
    {
        monto: 1000,
        cantidadDisponible: 1
    },
    {
        monto: 500,
        cantidadDisponible: 5
    },
    {
        monto: 200,
        cantidadDisponible: 1000
    },
    {
        monto: 100,
        cantidadDisponible: 5
    },
    {
        monto: 50,
        cantidadDisponible: 5
    }
]
let informe = ""
function calcularVuelto(valorDelBillete, billetesEnStock = 0) {

    let billetesRequeridos = Math.floor(montoARetirar / valorDelBillete)

    let resto = montoARetirar % valorDelBillete

    informe += `Se necesitan ${billetesRequeridos} billetes de ${valorDelBillete} para retirar $${montoARetirar}, sobrarían $${resto}.\n`

    if (billetesEnStock <= billetesRequeridos) {
        informe += `Tenemos ${billetesEnStock} billetes de ${valorDelBillete} para entregar.`
        resto += valorDelBillete * (billetesRequeridos - billetesEnStock)
    }

    informe += `Por lo tanto, falta devolver ${resto}. \n`

    montoARetirar = resto

}

billetesVigentes.forEach(bv => {
    calcularVuelto(bv.monto, bv.cantidadDisponible)
})

informe += `Te quedaron ${montoARetirar} en la cuenta. No es posible retirarlos pero tranquilo, nadie te los quitará`

console.log(informe)