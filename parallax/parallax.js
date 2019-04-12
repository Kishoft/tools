class Parallax{
    static movement(el, coordsX, coordsY){
        el.style['transform'] = `translate(${window.scrollY * coordsX}px, ${window.scrollY * coordsY}px)`;
    }

    constructor(){
        this.parallaxElements = Array.from(document.getElementsByClassName('parallax')).filter( x => x.hasAttribute('data-movementY') || x.hasAttribute('data-movementX'))
        this.parallaxElements.map(pElement =>{
            let x = Number(pElement.getAttribute('data-movementX')) || 0;
            let y = Number(pElement.getAttribute('data-movementY')) || 0;
            window.addEventListener('scroll', () =>{
                if( pElement.parentElement.getBoundingClientRect().bottom > 0 ){
                    requestAnimationFrame(()=>{
                        Parallax.movement(pElement, x, y)
                    })
                }
            })
        })
    }
}
Object.freeze(new Parallax);