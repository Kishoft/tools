<template>
  <article>
    <h2>Logical assigment operators - Operadores lógicos de asignación</h2>
    <dfn>Sirven para asignar variables bajo determinadas condiciones.</dfn>
    <section>
      <h3>AND</h3>
      <p>Si X es verdadero o válido, entonces se le asigna el valor de Y</p>
      <code>
        <pre>
//Forma larga
if(x) {
    x = y
}

//Forma intermedia
x && (x = y)

//Forma corta
x &&= y
</pre
        >
      </code>
    </section>
    <section>
      <h3>OR</h3>
      <p>Si X es falso o inválido, entonces se le asigna el valor de Y</p>
      <code>
        <pre>
//Forma larga
if(!x) {
    x = y
}

//Forma intermedia
x || (x = y)

//Forma corta
x ||= y
</pre
        >
      </code>
    </section>
    <section>
      <h3>Nullish</h3>
      <p>Si X es null o Undefined, se le asigna el valor de la derecha</p>
      <code>
        <pre>
//Forma larga
if(x !== null && x !== undefined){
    x = y
}

//Forma intermedia
x = x ?? (x = y)

//Forma corta
x ??= y
</pre
        >
      </code>
    </section>
  </article>
</template>

<script>
export default {}
</script>

<style>
</style>
