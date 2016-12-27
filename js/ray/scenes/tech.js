var THREE = require('three');
require('../vendor/three.orbitcontrols.js');
var Ray = require('../ray.js');

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec3, samplerCube } = Ray.types;

Ray.config.allUniforms = true;

var sky = new THREE.CubeTextureLoader().load([
    'img/posx.jpg', 'img/negx.jpg',
    'img/posy.jpg', 'img/negy.jpg',
    'img/posz.jpg', 'img/negz.jpg'
]);

var light1 = new Ray.Light({
    position: vec3( .9 , .9, .5 ),
    color: new Uniform( new THREE.Color(1, 1, 1) ),
    min: .2
})

var sphere = new Ray.Sphere();

var chrome = new Ray.Material({
    reflectivity: 1,
    color: vec3( 0 )
})

var torus = new Ray.Twist({
        amount: 2
    },
    new Ray.Noise({
        material: chrome,
        noiseScale: vec3(2),
        speed: vec3()
    },
    new Ray.Torus({
        thickness: .1,
        position: vec3(.5, 0, 0),
        rotation: new Uniform(),
        radius: new Uniform(),
        update: (torus) => {
            torus.rotation.x += 0.01;
            torus.rotation.z += 0.01;
            torus.radius = Math.sin(Date.now() / 5000) + 2;
        }
    })
    )
)
var scene = new Ray.Union(sphere, torus);

var ray = new Ray.THREERenderer( THREE, scene, {
    lights: [light1],
    background: sky
})

var controls = new THREE.OrbitControls( ray.camera );

ray.gui( new dat.GUI() );