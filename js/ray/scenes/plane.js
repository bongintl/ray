function octaveNoise( octaves, amount, scale, props, operand ) {
    
    var ret = operand;
    
    for ( var i = 0; i < octaves; i++ ) {
        
        var mult = Math.pow( 2, i );
        
        var options = {
            amount: amount / mult,
            noiseScale: vec3( scale.x * mult, scale.y * mult, scale.z * mult )
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

var land = new Ray.Blend({
        amount: new Uniform(),
    },
    new Ray.Cylinder({
        position: vec3(0, -.02, 0),
        height: .02
    }),
    new Ray.Sphere()
)

var sea = new Ray.Blend({
        amount: new Uniform(),
        material: seaMaterial
    },
    new Ray.Cylinder({
        position: vec3(0, -.02, 0),
        height: .02
    }),
    new Ray.Sphere()
)

var hills = new Ray.Noise({
    amount: new Ray.Uniform(),
    noiseScale: new Uniform( vec3(3) ),
    material: landMaterial,
    speed: vec3(0.05),
    rotation: new Uniform,
    update: o => o.rotation.y += 0.01
}, land)

var world = new Ray.Union( hills, sea );

var crop = new Ray.Cylinder({
    position: new Uniform( vec3(0, 1, 0) ),
    scale: vec3(1)
});

var cropped = new Ray.Intersect( crop, world );

var light1 = new Ray.Light({
    position: vec3( .9 , .9, .5 ),
    color: new Uniform( new THREE.Color(1, 1, 1) ),
    min: .2
})

var light2 = new Ray.Light({
    position: vec3(-0.5, -0.75, -0.5),
    color: new Uniform( new THREE.Color(.5, .5, .5) )
})

var ray = new Ray.THREERenderer( THREE, cropped, {
    lights: [light1, light2]
})

var controls = new THREE.OrbitControls( ray.camera );

var gui = new dat.GUI();

//ray.gui( gui );

gui.add(sea, 'amount', 0, 1).step(.01).onChange(v => {
    land.amount = v;
    crop.scale.x = crop.scale.y = crop.scale.z = v + 1;
    hills.noiseScale.x = hills.noiseScale.y = hills.noiseScale.z = (v * 4) + 2;
    hills.amount = (1 - v*v) * .2 + .05;
    crop.position.y = .5 - v;
})

var addColor = ( gui, object, property, name ) => {

    var dummy = {};
    
    dummy[ property ] = object[ property ].getStyle(); 
    
    gui = gui.addColor( dummy, property ).name( name || property );
    
    gui.onChange( value => object[ property ].setStyle( value ) );
    
    return gui;
    
};

addColor( gui, light1, 'color', 'light1' )
addColor( gui, light2, 'color', 'light2' )