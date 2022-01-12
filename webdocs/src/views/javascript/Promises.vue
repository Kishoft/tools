<template>
  <article>
    <h2>Promises</h2>
    <dfn
      >Sirven para controlar el flujo de ejecución de los métodos y funciones de
      JS. Una promesa siempre devuelve objeto tipo Pending, hasta que se
      resuelva</dfn
    >
    <section>
      <h3>Promise Constructor</h3>
      <code>
        <pre>
new Promise((resolve, reject) => {
    if(condición){
        resolve('Algo salió bien')
    }
    else{
        reject('Algo salio mal')
    }
})
</pre
        >
      </code>
    </section>
    <section>
      <h3>Promise.all()</h3>
      <dfn
        >Devuelve una promesa que termina cuando todas las promesas del
        argumento iterable hayan sido cumplidas, o APENAS se rechace una de las
        promesas se para la ejecución y se dispara el reject, ojo con eso</dfn
      >
    </section>
    <section>
      <h3>Promise.allSettled()</h3>
      <dfn
        >Devuelve una promesa que termina cuando todas las promesas del
        argumento iterable hayan sido cumplidas o rechazadas, éste método a
        diferencia de ".all" nunca se interrumpe hasta que no hayan terminado
        bien o mal las promesas, luego mostrará el resultado de cada una</dfn
      >
    </section>
    <section>
      <h3>Promise.any()</h3>
      <dfn
        >Devuelve el resultado de UNA de las promesas del argumento iterable que
        haya terminado lo antes posible O si una de ellas falla se omite y no se
        devuelve el resultado, si fallan todas, entonces se emite un
        "AggregateError", es útil cuando necesitamos el resultado más rápido sin
        fallos</dfn
      >
    </section>
    <section>
      <h3>Promise.race()</h3>
      <dfn
        >Devuelve el resultado de UNA de las promesas del argumento iterable que
        haya terminado lo antes posible, a diferencia de any no importa si
        termina bien o mal, solo debe terminar rápido y se devuelve el resolve o
        reject</dfn
      >
    </section>
  </article>
</template>

<script>
export default {}
</script>

<style>
</style>
