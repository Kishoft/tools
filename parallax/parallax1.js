class Parallax{
    static movement(el, coordsY, coordsX){
        el.style['transform'] = `translate3d(${window.scrollY * coordsX}px, ${window.scrollY * coordsY}px, 0)`;
    }

    constructor(){
        this.objects = Array.from(document.getElementsByClassName('parallax')).filter( x => x.hasAttribute('data-movementY') || x.hasAttribute('data-movementX'))
        console.log(this.objects)
        this.coordsX = 2;
        this.coordsY = 1;

        console.log(this.objects)
        
        window.addEventListener('scroll', ()=>{
            this.objects.map((object)=>{
                Parallax.movement(object, object.attributes['data-movementy'].value, object.attributes['data-movementx'].value)
            })
        })
    }

}

new Parallax