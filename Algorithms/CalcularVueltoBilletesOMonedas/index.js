class Cajero {
    static montoARetirar = 9750;
    static billetesVigentes = [
        { 
            monto : 1000,
            cantidadDisponible: 1
        },
        { 
            monto : 500,
            cantidadDisponible: 5
        },
        { 
            monto : 200,
            cantidadDisponible: 5
        },
        { 
            monto : 100,
            cantidadDisponible: 5
        },
        { 
            monto : 50,
            cantidadDisponible: 5
        }
    ]
    static calcularVuelto(montoDelBillete, cantidadDisponible){
        let billetesRequeridos = Math.floor(Cajero.montoARetirar / montoDelBillete)
        console.log(`se necesitan ${billetesRequeridos} billetes de ${montoDelBillete}`)
        console.log(`tenemos ${cantidadDisponible} y necesitamos ${billetesRequeridos}`)

        let resto = Cajero.montoARetirar % montoDelBillete;

        if(cantidadDisponible < billetesRequeridos){
            resto += montoDelBillete * (billetesRequeridos - cantidadDisponible)
        }
        
        console.log(`todavía quedan por pagar $${resto}`)

        Cajero.montoARetirar = resto
    }
    static calcularVueltoTotal(){
        Cajero.billetesVigentes.forEach(billeteVigente => {
            Cajero.calcularVuelto(billeteVigente.monto, billeteVigente.cantidadDisponible)
        })
    }
}

Cajero.calcularVueltoTotal()