var THREEMaterial = require('./threematerial');
var Uniform = require('../core/uniform');
var THREEGui = require('./gui');

module.exports = class THREERenderer {
    
    constructor( THREE, scene, globals, options ) {
        
        globals = globals || {};
        
        this.THREE = THREE;
        
        options = Object.assign( {}, this.defaults(), options || {} );
        
        this.scene = scene;
        
        this.renderScene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            alpha: 'backgroundAlpha' in globals
        });
        
        //this.renderer.setClearColor( 0xffffff, 0 );
        
        this.renderCamera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1);
        this.geometry = new THREE.BufferGeometry();
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0]), 3 ) );
        
        var shaderOptions = Object.assign( globals || {}, {
        });
        
        this.material = new THREEMaterial( THREE, scene, shaderOptions );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.renderScene.add( this.mesh );
        
        this.shader = this.material.shader;
        this.uniforms = this.material.uniforms;
        this.globals = this.material.globals;
        
        if ( options.element ) options.element.appendChild( this.renderer.domElement );
        
        if ( options.fullscreen ) {
            window.addEventListener( 'resize', this.onResize.bind(this) );
            this.onResize();
        }
        
        if ( options.autoUpdate ) this.tick();
        
    }
    
    defaults () {
        
        return {
            fullscreen: true,
            autoUpdate: true,
            element: document.body
        }
        
    }
    
    onResize() {
        
        this.setSize( window.innerWidth, window.innerHeight );
        
    }
    
    setSize(w, h) {
        
        this.renderer.setSize( w, h );
        this.shader.setSize( w, h );
        
    }
    
    update () {
        
        this.shader.update();
        
    }
    
    render () {
        
        this.renderer.render( this.renderScene, this.renderCamera );
        
    }
    
    tick () {
        
        var ticker = () => {
            
            requestAnimationFrame( ticker );
            
            this.update();
            this.render();
            
        }
        
        ticker();
        
    }
    
    gui ( datGUI ) {
        
        THREEGui( this.THREE, datGUI, this.scene );
        
    }
    
}