class Parallax{
    static movement(el, coordsX, coordsY){
        el.style['transform'] = `translate3d(${window.scrollY * coordsX}px, ${window.scrollY * coordsY}px, 0)`;
    }

    constructor(Container, CoordsY, CoordsX){
        this.contenedor = Container;
        this.coordsY = CoordsY;
        this.coordsX = CoordsX || 0;
        
        window.addEventListener('scroll', () =>{
            requestAnimationFrame(()=>{
                Parallax.movement(this.contenedor, this.coordsX, this.coordsY)
            })
        })
    }
}

new Parallax(document.getElementById('headerImg1'), 0.5)
new Parallax(document.getElementById('headerImg2'), 0.3)