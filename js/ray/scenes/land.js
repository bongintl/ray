function octaveNoise( octaves, amount, scale, props, operand ) {
    
    var ret = operand;
    
    for ( var i = 0; i < octaves; i++ ) {
        
        var mult = Math.pow( 3, i );
        
        var options = {
            amount: amount / mult,
            noiseScale: vec3( scale.x * mult, scale.y * mult, scale.z * mult ),
            speed: vec3(.05)
        }
        
        if ( i === octaves - 1 ) Object.assign( options, props );
        
        ret = new Ray.Noise( options, ret )
        
    }
    
    return ret;
    
}

var THREE = require('three');
require('../vendor/three.orbitcontrols.js');
var Ray = require('../ray.js');

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec3 } = Ray.types;

//Ray.config.allUniforms = true;

var landMaterial = new Ray.Material({
    color: vec3( 148/255, 116/255, 90/255 ),
    specular: 0
})

var seaMaterial = new Ray.Material({
    color: vec3( 0, .1, .5 ),
    reflectivity: .5
})

var land = new Ray.Sphere();

var sea = new Ray.Sphere({
    material: seaMaterial
});

//var hills = octaveNoise( 4, .2, vec3(1), {material: landMaterial}, land );

var hills = octaveNoise(3, .05, vec3(4), {material: landMaterial}, land);

var world = new Ray.Union( hills, sea );

var crop = new Ray.Sphere({
    position: vec3(0, .5, 0),
    scale: new Uniform(),
    radius: 2
})

var scene = new Ray.Intersect( crop, world );

var light1 = new Ray.Light({
    position: vec3( .9 , .9, .5 ),
    color: new Uniform( new THREE.Color(1, 1, 1) ),
    min: .2
})

var light2 = new Ray.Light({
    position: vec3(-0.5, -0.75, -0.5),
    color: new Uniform( new THREE.Color(.5, .5, .5) )
})

var ray = new Ray.THREERenderer( THREE, scene, {
    lights: [light1, light2]
})

var controls = new THREE.OrbitControls( ray.camera );

var gui = new dat.GUI();

gui.add({i:1}, 'i', .05, 1).step(-.01).onChange(v => {
    crop.scale.x = crop.scale.y = crop.scale.z = v;
})

//ray.gui( gui );

// gui.add(sea, 'amount', 0, 1).step(.01).onChange(v => {
//     land.amount = v;
//     crop.scale.x = crop.scale.y = crop.scale.z = v + 1;
//     hills.noiseScale.x = hills.noiseScale.y = hills.noiseScale.z = (v * 4) + 2;
//     hills.amount = (1 - v) * .2;
//     crop.position.y = 1 - v;
//     crop.scale.x = crop.scale.y = 1 - v + .02;
// })

var addColor = ( gui, object, property, name ) => {

    var dummy = {};
    
    dummy[ property ] = object[ property ].getStyle(); 
    
    gui = gui.addColor( dummy, property ).name( name || property );
    
    gui.onChange( value => object[ property ].setStyle( value ) );
    
    return gui;
    
};

addColor( gui, light1, 'color', 'light1' )
addColor( gui, light2, 'color', 'light2' )