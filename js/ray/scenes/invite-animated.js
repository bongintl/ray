var THREE = require('three');
require('../vendor/three.orbitcontrols.js');
var tween = require('./lib/tween');
var eases = require('eases');

var Ray = require('../ray.js');

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec3, samplerCube } = Ray.types;

var material = new Ray.Material({
    color: new THREE.Color(1,1,1),
    emissive: new Uniform( new THREE.Color(0,0,0) ),
    //refraction: 2/3
})

var sphere = new Ray.Sphere({radius: 1.375});
var cube = new Ray.Box({size: vec3(1.375)});
var sqube = new Ray.Blend( { amount: new Uniform(0) }, sphere, cube );
var noise = new Ray.Noise({
    amount: new Uniform(.1),
    noiseScale: new Uniform( vec3(.1) ),
    speed: new Uniform( vec3(.2) )
}, sqube);
var twistZ = new Ray.Twist({amount: new Uniform(0)}, noise);
var twistY = new Ray.Twist({amount: new Uniform(0), rotation: vec3(Math.PI/2, 0, 0)}, twistZ);
var cropSphere = new Ray.Sphere({radius: new Uniform(10)});
var cropBox = new Ray.Box({size: new Uniform(vec3(10))});
var cropSqube = new Ray.Blend({amount: new Uniform(0) }, cropSphere, cropBox);
var scene = new Ray.Intersect({
    material,
    rotation: new Uniform()
}, cropSqube, twistY );

var light1 = new Ray.Light({
    position: vec3( .9 , .9, .5 ),
    color: new Uniform( new THREE.Color(0, 0, 1) ),
    min: .2
})

var light2 = new Ray.Light({
    position: vec3(-0.5, -0.75, -0.5),
    color: new Uniform( new THREE.Color(1, 1, 0) )
})

var noLight = new Ray.Light({color: new THREE.Color('black')});

var ray = new Ray.THREERenderer( THREE, scene, {
    lights: [light1, light2],
    //lights: [noLight],
    background: new THREE.Color('white'),
    //background: samplerCube('img/Collecting_Europe_typeset.jpg')
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

}

animate();

var STATES = [
    [ .07, .41, 1.35, 1.35, 1.24, 1, 2, 1, 2, 0, 0, 255, 255, 0, 0, 0, 0, 0, 0 ],
    [ .07, .56, 1.35, 1.35, 1.24, .2, 2, 1, 2, 182, 182, 208, 210, 255, 0, 0, 0, 0, 0 ],
    [ .07, .65, 0.74, 0.74, 0.52, .08, 2, 0, 2, 227, 125, 0, 0, 255, 239, 0, 0, 0, 0 ],
    [ .85, .14, 0.74, 2.89, 1.29, .38, 5, 2, 2, 15, 14, 11, 255, 0, 255, 0, 0, 0, 0 ],
    [ .08, 1.82, 1.29, 1.29, 1.18, .23, 2, 2, 1.61, 6, 67, 250, 0, 165, 255, 0, 0, 0, 0 ],
    [ .52, 0.23, 1.29, 3.06, 1.13, .11, 4, 3, 1.81, 235, 235, 235, 178, 196, 190, 0, 0, 0, Math.PI / 2 ]
];

STATES.push(STATES[0]);

function apply ( state ) {
    
    sqube.amount = cropSqube.amount = state[0];
    noise.amount = state[1]
    noise.noiseScale.x = state[2];
    noise.noiseScale.y = state[3];
    noise.noiseScale.z = state[4];
    //noise.speed.x = noise.speed.y = noise.speed.z = state[5];
    twistZ.amount = state[6];
    twistY.amount = state[7];
    cropSphere.radius = cropBox.size.x = cropBox.size.y = cropBox.size.z = state[8];
    light1.color.r = state[9] / 255;
    light1.color.g = state[10] / 255;
    light1.color.b = state[11] / 255;
    light2.color.r = state[12] / 255;
    light2.color.g = state[13] / 255;
    light2.color.b = state[14] / 255;
    material.emissive.r = state[15] / 255;
    material.emissive.g = state[16] / 255;
    material.emissive.b = state[17] / 255;
    scene.rotation.x = state[18];
    
}

function lerp ( position ) {
    
    var fromState = STATES[ Math.floor( position ) ];
    var toState = STATES[ Math.ceil(position) ];
    var progress = eases.quadInOut( position % 1 );
    
    apply( fromState.map( (x, i) => x + (( toState[i] - x ) * progress) ) );
    
}

function go(){
    tween(0, 5.999, 60000, lerp).then(go);
}

go();