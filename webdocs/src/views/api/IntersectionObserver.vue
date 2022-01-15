<template>
  <article>
    <h2>Intersection Observer</h2>
    <p>
      Provee una forma asíncrona para observar cambios en la intersección del
      elemento objetivo con elemento ancestro (padre, abuelo, etc) o viewport
    </p>
    <p>
      Historicamente, detectar la visibilidad de un elemento o la visibilidad
      relativa entre dos elementos era una tarea difícil que ocasionaba
      problemas en el navegador. Ya no es así con esta api. Algunos casos de
      utilidad pueden ser:
    </p>
    <ul>
      <li>Lazy loading de contenido</li>
      <li>Scroll infinito</li>
      <li>Cargar publicidad</li>
      <li>Y un montón de etcéteras que dependan de la visibilidad</li>
    </ul>
    <section>
      <h3>Comprobar que se pueda utilizar</h3>
      <code>
        <pre>
if ("IntersectionObserver" in window) {
    /*Se puede utilizar*/
}
else {
    /* API no disponible */
}
              </pre
        >
      </code>
    </section>
    <section>
      <h3>Conceptos al utilizar esta API</h3>
      <p>
        El observador nos pedirá una función como callback a ejecutar, la misma
        se disparará cuando:
      </p>
      <ul>
        <li>
          El elemento objetivo intersecta el "viewport" y otra un elemento
          especificado. Ese elemento especificado, es llamado "root element" o
          "root" a ojos del observador.
        </li>
        <li>
          La primera vez que se le pide inicialmente al observador que mire un
          elemento objetivo.
        </li>
      </ul>
      <p>
        Ya sea que esté utilizando el viewport o algún otro elemento como el
        root, la API funciona de la misma manera, ejecutando una función de
        callback que proporciona cada vez que cambia la visibilidad del elemento
        de destino para que cruce las cantidades deseadas de intersección con el
        root.
      </p>

      <p>
        Esta es una representación del porcentaje del elemento de destino que es
        visible como un valor entre 0,0 y 1,0.
      </p>
    </section>
    <section>
      <h3>Creando un Intersection Observer</h3>
      <code>
        <pre>
let options = {
    root: document.querySelector('#scrollArea'),
    rootMargin: '0px',
    threshold: 1.0
}

let observer = new IntersectionObserver(callback, options);
            </pre
        >
      </code>
      <p>
        Un threshold (umbral) de 1.0, supone que cuando el 100% del objetivo es
        visible entre el root y el elemento especificado, el callback es
        invocado
      </p>
    </section>
    <section>
      <h3>Opciones del IntersectionObserver</h3>
      <dl>
        <dt>root</dt>
        <dd>El elemento que es utilizado como viewport para comprobar la visibilidad del objetivo. Debe ser un ancestro del objetivo (padre, abuelo o superior). Por defecto es el "viewport" del navegador.</dd>
        <dt>rootMargin</dt>
        <dd>El margen al rededor del "root", Puede tener valores similares a la propiedad "margin" de CSS. Por ejemplo "10px 20px 30px 40px" (top, right, bottom, left). Los valores pueden ser porcentuales. Por defecto son todos 0. Ten en cuenta que los márgenes van hacia dentro del objeto.</dd>
        <dt>threshold</dt>
        <dd>Ya sea un solo Number o un Array de números que indican en qué porcentaje de la visibilidad del objetivo se debe ejecutar el callback del observador. Si solo desea detectar cuándo la visibilidad supera la marca del 50%, puede usar un valor de 0.5. Si desea el callback se ejecutará cada vez que la visibilidad pase otro 25 %, debe especificar la matriz [0, 0,25, 0,5, 0,75, 1]. El valor predeterminado es 0 (lo que significa que tan pronto como un píxel sea visible, se ejecutará el callback) Un valor de 1,0 significa que no se considera superado el umbral hasta que todos los píxeles son visibles.</dd>
      </dl>
    </section>
    <section>
        <h3>Seleccionando un elemento para ser observado</h3>
        <p>Además del fragmento de código anterior, necesitaremos completar con lo siguiente:</p>
        <code>
            <pre>
let target = document.querySelector('#listItem');

observer.observe(target);

let callback = (entries, observer) => {
    entries.forEach(entry => {
        // Each entry describes an intersection change for one observed
        // target element:
        //   entry.boundingClientRect
        //   entry.intersectionRatio
        //   entry.intersectionRect
        //   entry.isIntersecting
        //   entry.rootBounds
        //   entry.target
        //   entry.time
    });
};
            </pre>
        </code>
        <p>La lista de entradas recibidas por el callback, incluyen un objeto por cada objetivo que haya reportado un cambio. Comprueba el valor de la propiedad "isIntersecting" para saber cuál elemento se intersectó con el root.</p>
        <p>CUIDADO, el callback se ejecutará en el main thread. Podes usar <pre>Window.requestIdleCallback()</pre> para evitar problemas.</p>
        <p>Y otra cosa, el elemento objetivo debe ser un descendiente del root, SIEMPRE.</p>
    </section>
  </article>
</template>

<script>
export default {}
</script>

<style>
</style>
