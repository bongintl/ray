var THREE = require('three');
require('../vendor/three.orbitcontrols.js');

var Ray = require('../ray.js');

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec3 } = Ray.types;

//Ray.config.allUniforms = true;

var sky = new THREE.CubeTextureLoader().load([
    'img/posx.jpg', 'img/negx.jpg',
    'img/posy.jpg', 'img/negy.jpg',
    'img/posz.jpg', 'img/negz.jpg'
]);

var scene = new Ray.Union({
        material: new Ray.Material({
            reflectivity: 1
        })
    }, 
    new Ray.Box({
        position: vec3(0,0,-5),
        size: vec3(2),
        rotation: new Uniform(),
        update: box => {
            box.rotation.x += .01;
            box.rotation.z += .01;
        }
    }),
    new Ray.Twist({
            amount: 3
        },
        new Ray.Noise(new Ray.Sphere())
    )
)

var ray = new Ray.THREERenderer( THREE, scene, {
    background: sky
});

var controls = new THREE.OrbitControls( ray.camera );
controls.autorotate = true;

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

//ray.gui( gui );

gui.add( controls, 'autorotate' );

