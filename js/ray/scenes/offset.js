var THREE = require('three');
require('../vendor/three.orbitcontrols.js');
var Ray = require('../ray.js');

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec3, samplerCube } = Ray.types;

Ray.config.allUniforms = true;

var light1 = new Ray.Light({
    position: vec3( .9 , .9, .5 ),
    color: new Uniform( new THREE.Color(1, 1, 1) ),
    min: .2
})

var scene = new Ray.Offset( new Ray.Noise( new Ray.Sphere() ) );

var ray = new Ray.THREERenderer( THREE, scene, {
    lights: [light1],
})

var controls = new THREE.OrbitControls( ray.camera );

ray.gui( new dat.GUI() );