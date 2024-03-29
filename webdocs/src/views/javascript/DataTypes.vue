<template>
  <article>
    <h2>Data Types (Tipos de datos)</h2>
    <section>
      <p>Hay varias maneras de representar información en JS</p>
      <dl>
        <dt>String (cadenas de texto)</dt>
        <dd>
          <ul>
            <li>"String"</li>
            <li>'String'</li>
            <li>`String`</li>
          </ul>
        </dd>
        <dt>Number (Números) - Son Integers o Floating Points</dt>
        <dd>
          <ul>
            <li>3</li>
            <li>3.234</li>
            <li>3e+2 (la e es de exponente)</li>
          </ul>
        </dd>
        <dt>
          BigInt (Gran entero) - Son Integers de precisión arbitraria (ocupan
          tanto espacio como tengas)
        </dt>
        <dd>
          <ul>
            <li>
              792834732894723984723894n (Se les pone una "n" al final al momento
              de declararlos sin constructor)
            </li>
          </ul>
        </dd>
        <dt>Boolean - True o False, representan 2 estados</dt>
        <dd>
          <ul>
            <li>True</li>
            <li>False</li>
          </ul>
        </dd>
        <dt>
          Undefined - Aparecen cuando una variable se inicia sin valor definido
        </dt>
        <dd>
          <code>let variable; //Devuelve undefined</code>
        </dd>
        <dt>
          Null - Se utiliza para dejar vacía una variable, constante o propiedad
        </dt>
        <dd>
          <code>let variable = null;</code>
        </dd>
        <dt>
          Infinity - Representa un número infinito, también puede ser negativo
        </dt>
        <dd>
          <code>let infinito = Infinity;</code>
        </dd>
        <dt>
          Symbol - Sus instancias son únicas e inmutables, similar a propiedades
          privadas de una clase
        </dt>
        <dd>
          <code>
            <pre>
let variable = Symbol();

//Podemos usarlo para hacer propiedades privadas sin usar clases

let objeto = {
    [variable] : "World"
}

//Cuando llamemos a objeto[variable], devolverá un Symbol inmutable
</pre
            >
          </code>
        </dd>
        <dt>
          Object - Conjunto de "par NO ordenado del tipo clave-valor" que
          representa una "instancia anónima", sus claves (keys) solo pueden ser
          "String" y "Symbol"
        </dt>
        <dd>
          <code>
            <pre>
let objeto = {
    prop1 : 'String',
    prop2 : 1234,
    prop3 : true,
    prop4 : {},
    prop5 : []
}
</pre
            >
          </code>
        </dd>
        <dt>
          Set - Conjunto de "valores únicos iterables SIN índice interno
          implícito", por lo tanto no garantiza conservar el orden
        </dt>
        <dd>
          <code>
            <pre>
let set = new Set();
set.add(1);
set.add(1);
set.add(2);

//Solo almacena [1, 2], el valor repetido se descarta
</pre
            >
          </code>
        </dd>
        <dt>
          Map - Conjunto de "par clave-valor iterable por orden de insersión de
          su contenido", similar a los Object con la diferencia que su clave
          (key) puede ser "String", "Number", "Object" o incluso NaN y se pueden
          iterar directamente
        </dt>
        <dd>
          <code>
            <pre>
let map = new Map();

map.set("clave","valor");
</pre
            >
          </code>
        </dd>
        <dt>
          Array - Conjunto de "valores repetibles e interables con índice
          implícito". Conservan el orden de insersión
        </dt>
        <dd>
          <code> let array = ['uno', 'dos', 'tres'];</code>
        </dd>
      </dl>
    </section>
  </article>
</template>

<script>
export default {}
</script>

<style>
</style>
