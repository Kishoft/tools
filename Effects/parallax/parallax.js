class Parallax{
    static movement(el, coordsX, coordsY){
        el.style['transform'] = `translate(${window.scrollY * coordsX}px, ${window.scrollY * coordsY}px)`;
    }
    constructor(){

        this.parallaxElements = Array.from(document.getElementsByClassName('parallax')).filter( x => x.hasAttribute('data-movementY') || x.hasAttribute('data-movementX'))
        this.parallaxElements.map(el =>{
            let x = Number(el.getAttribute('data-movementX')) || 0;
            let y = Number(el.getAttribute('data-movementY')) || 0;
            let listener = () =>{
                requestAnimationFrame( ()=>{ Parallax.movement(el, x, y) })
            }
            new IntersectionObserver((changes)=>{
                if(changes[0].isIntersecting){
                    window.addEventListener('scroll', listener)
                }
                else{
                    window.removeEventListener('scroll', listener, false)
                }
            }).observe(el.parentElement)
        })
    }
}
if(!window.matchMedia('(max-width: 650px)').matches){
    Object.freeze(new Parallax);
}