var THREE = require('three');
require('../vendor/three.orbitcontrols.js');

var Ray = require('../ray.js');

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec3, samplerCube } = Ray.types;

var material = new Ray.Material({
    color: vec3(0),
    //color: new Uniform( new THREE.Color('black') ),
    //emissive: new Uniform( new THREE.Color('black') ),
    refraction: new Uniform( 2/3 )
})

var sphere = new Ray.Sphere({radius: 1.375});
var cube = new Ray.Box({size: vec3(1.375)});
var sqube = new Ray.Blend( { amount: new Uniform(0) }, sphere, cube );
var noise = new Ray.Noise({
    amount: new Uniform(.56),
    noiseScale: new Uniform( vec3(2.1, .6, 1.3) ),
    speed: new Uniform( vec3(0) )
}, sqube);
var twistZ = new Ray.Twist({amount: new Uniform(0)}, noise);
var twistY = new Ray.Twist({amount: new Uniform(2), rotation: vec3(Math.PI/2, 0, 0)}, twistZ);
var cropSphere = new Ray.Sphere({radius: new Uniform(10)});
var cropBox = new Ray.Box({size: new Uniform(vec3(10))});
var cropSqube = new Ray.Blend({amount: new Uniform(0) }, cropSphere, cropBox);
var scene = new Ray.Intersect({
    material
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

var ray = new Ray.THREERenderer( THREE, scene, {
    lights: [light1, light2],
    background: samplerCube('img/europe_1.jpg'),
    // background: vec3(1),
    time: new Uniform( 0 ),
});

//var controls = new THREE.OrbitControls( ray.camera );
//controls.autorotate = false;

var then = Date.now();

function animate() {

    requestAnimationFrame( animate );
    
    var now = Date.now();
    
    // if(controls.autorotate) {
    //     controls.rotateLeft( (now - then) / 3000 );
    //     controls.update();
    // }
    
    then = now;

}

animate();

var gui = new dat.GUI();

gui.add(sqube, 'amount', 0, 1).step(.01).name('sqube').onChange( v => {
    cropSqube.amount = v;
})

var f = gui.addFolder('noise');
f.add(noise, 'amount', 0, 2).step(.01);
f.add(noise.noiseScale, 'x', 0, 5).step(.01);
f.add(noise.noiseScale, 'y', 0, 5).step(.01);
f.add(noise.noiseScale, 'z', 0, 5).step(.01);
f.add(noise.speed, 'x', 0, 1).step(.01).name('speed').onChange( v => {
    noise.speed.y = v;
    noise.speed.z = v;
})
f.open()

gui.add(twistZ, 'amount', 0, 5).step(.01).name('Twist Z');
gui.add(twistY, 'amount', 0, 5).step(.01).name('Twist Y');

gui.add(cropSphere, 'radius', .5, 10).step(.01).name('crop').onChange( v => {
    cropBox.size.x = cropBox.size.y = cropBox.size.z = v;
})

var addColor = ( gui, object, property, name ) => {

    var dummy = {};
    
    dummy[ property ] = object[ property ].getStyle(); 
    
    gui = gui.addColor( dummy, property ).name( name );
    
    gui.onChange( value => object[ property ].setStyle( value ) );
    
    return gui;
    
};

if( material.refraction ) gui.add(material, 'refraction', 0, 1).step(.01);

var button = document.createElement('button');
button.innerText = "Big";
button.style.position = 'fixed';
button.style.top = 0;
button.style.left = 0;
document.body.appendChild(button);

button.addEventListener('click', () => {
    ray.setSize( 4096, 4096 );
    ray.renderer.domElement.style.width = ray.renderer.domElement.style.height = '100vh';
})

var f2 = gui.addFolder('Lighting');
addColor( f2, light1, 'color', 'light0');
addColor( f2, light2, 'color', 'light1');

f2.open();

//gui.add( controls, 'autorotate' );