var THREE = require('three');
require('../vendor/three.orbitcontrols.js');

var Ray = require('../ray.js');

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec3, samplerCube } = Ray.types;

Ray.config.allUniforms = true;

var sky = samplerCube('img/europe.jpg');

var scene = new Ray.Twist({
        amount: 3
    },
    new Ray.Noise({
        material: new Ray.Material({
            color: new Uniform( new THREE.Color('black') ),
            emissive: new Uniform( new THREE.Color('black') ),
            refraction: 2/3
        })
    },
    new Ray.Sphere())
)

var ray = new Ray.THREERenderer( THREE, scene, {
    background: sky
});

var controls = new THREE.OrbitControls( ray.camera );
controls.autorotate = false;

var then = Date.now();

function animate() {

    requestAnimationFrame( animate );
    
    var now = Date.now();
    
    if(controls.autorotate) {
        controls.rotateLeft( (now - then) / 3000 );
        controls.update();
    }
    
    then = now;
    
    //ray.update();
    //ray.render();

}

animate();

var gui = new dat.GUI();

ray.gui( gui );

gui.add( controls, 'autorotate' );

