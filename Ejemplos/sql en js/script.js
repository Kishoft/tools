const lugares = 
[
    {
        _id: "12543534",
        nombre: "depo1",
        sectores:
        [
            {_id_producto: "1", cantidad: 4},
            {_id_producto: "2", cantidad: 6},
            {_id_producto: "3", cantidad: 3},
            {_id_producto: "4", cantidad: 4},
            {_id_producto: "5", cantidad: 8}
        ]
    }
]
const productos = 
[
    {
        _id:"1",
        nombre: "Coca cola",
        precio: [
            {
                _id_lista: "",
                valor: 2
            }
        ]

    },
    {
        _id:"2",
        nombre: "Manaos",
        precio: [
            {
                _id_lista: "",
                valor: 23
            }
        ]

    },
    {
        _id:"3",
        nombre: "Bichi",
        precio: [
            {
                _id_lista: "",
                valor: 24
            }
        ]

    },
    {
        _id:"4",
        nombre: "Pepew",
        precio: [
            {
                _id_lista: "",
                valor: 25
            }
        ]

    },
    {
        _id:"5",
        nombre: "No sé",
        precio: [
            {
                _id_lista: "",
                valor: 26
            }
        ]

    }
]

let resultado = ""

lugares.forEach(lugar => {

    resultado += `<h1>${lugar.nombre}</h1><ul>`

    lugar.sectores.forEach(sector =>{
        
        resultado +=`<li>Hay ${sector.cantidad} productos ${productos.find(elem => elem._id === sector._id_producto).nombre}, tienen el ID:  ${sector._id_producto} </li>`
    })

    resultado += `</ul>`
});

const innerJoin = (xs, ys, sel) =>
    xs.reduce((zs, x) =>
    ys.reduce((zs, y) =>        // cartesian product - all combinations
    zs.concat(sel(x, y) || []), // filter out the rows and columns you want
    zs), []);

const userProfiles2 = [
    {id: 1, name: "Ashok"},
    {id: 2, name: "Amit"},
    {id: 3, name: "Rajeev"},
];

const questions2 = [
    {id: 1, text: "text1", createdBy: 2},
    {id: 2, text: "text2", createdBy: 2},
    {id: 3, text: "text3", createdBy: 1},
    {id: 4, text: "text4", createdBy: 2},
    {id: 5, text: "text5", createdBy: 3},
    {id: 6, text: "text6", createdBy: 3},
];

const result = innerJoin(userProfiles2, questions2,
    ({id: uid, name}, {id, text, createdBy}) =>
        createdBy === uid && {id, text, name});

document.body.innerHTML = resultado + "<br><br><br><br><br>"

console.log(result)


let userProfiles = [ { id: 3, name: "Paquito"}, { id: 2, name: "Jaime" } ];
let questions = [ { id: 22, text: "My question", createdBy: 3 }, { id: 44, text: "Other question", createdBy: 5 } ];

let left_join = questions
.map ( q => ({ ...userProfiles.find( u => q.createdBy === u.id ), ...q }) );

document.write("<p>Left join: <br>", JSON.stringify(left_join));

let right_join = userProfiles
.map ( u => ({ ...questions.find( q => q.createdBy === u.id ), ...u }) );;

document.write("</p><p>Right join: <br>", JSON.stringify(right_join));

let inner_join = questions
.filter( q => userProfiles.find( u => q.createdBy === u.id ) )
.map ( q => ({ ...userProfiles.find( u => q.createdBy === u.id ), ...q }) );


console.log(userProfiles)
console.log(questions)

document.write("</p><p>Inner join: <br>", JSON.stringify(inner_join))