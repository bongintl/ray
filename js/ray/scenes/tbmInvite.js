var THREE = require('three');
require('../vendor/three.orbitcontrols.js');

var Ray = require('../ray.js');

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec3 } = Ray.types;

var material = new Ray.Material({
    color: new THREE.Color(1,1,1),
    emissive: new Uniform( new THREE.Color(0,0,0) )
})
var sphere = new Ray.Sphere({radius: 1.375});
var cube = new Ray.Box({size: vec3(1.375)});
var sqube = new Ray.Blend( { amount: new Uniform(0) }, sphere, cube );
var noise = new Ray.Noise({
    amount: new Uniform(.1),
    noiseScale: new Uniform( vec3(.1) ),
    speed: new Uniform( vec3(1) )
}, sqube);
var twistZ = new Ray.Twist({amount: new Uniform(0)}, noise);
var twistY = new Ray.Twist({amount: new Uniform(0), rotation: vec3(Math.PI/2, 0, 0)}, twistZ);
var cropSphere = new Ray.Sphere({radius: new Uniform(10)});
var cropBox = new Ray.Box({size: new Uniform(vec3(10))});
var cropSqube = new Ray.Blend({amount: new Uniform(0) }, cropSphere, cropBox);
var scene = new Ray.Intersect({
    material
}, cropSqube, twistY );

var light1 = new Ray.Light({
    position: vec3( 9 , 9, 5 ),
    color: new Uniform( new THREE.Color(0, 0, 1) ),
    min: .2
})

var light2 = new Ray.Light({
    position: vec3(-5, -7.5, -05),
    color: new Uniform( new THREE.Color(1, 1, 0) )
})

var ray = new Ray.THREERenderer( THREE, scene, {
    lights: [light1, light2],
    //backgroundAlpha: 0,
    threshold: new Uniform(5)
});

//ray.setSize(4096, 4096);

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

var f2 = gui.addFolder('Lighting');
addColor( f2, light1, 'color', 'light0');
addColor( f2, light2, 'color', 'light1');
addColor( f2, material, 'emissive', 'diffuse' );

f2.open();

ray.setSize(window.innerHeight, window.innerHeight);
ray.renderer.domElement.style.width = ray.renderer.domElement.style.height = '100vh';

gui.add(ray.shader, 'threshold', .01, 10).step(.01);

// gui.add( controls, 'autorotate' );

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



//