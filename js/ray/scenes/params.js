var slider = require('./lib/sliders');
var slowMouse = require('./lib/slowMouse');
var THREE = require('three');
require('../vendor/three.orbitcontrols.js');
var Ray = require('../ray.js');
var clamp = require('../../lib/clamp')

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec2, vec3, samplerCube } = Ray.types;

var light1 = new Ray.Light({
    position: new Uniform( vec3( .9, .9, 8 ) ),
    color: new Uniform( new THREE.Color(.8, .8, .8) ),
    brightness: new Uniform(),
    min: new Uniform()
})

var material = new Ray.Material({
    color: vec3(1),
    specularHardness: new Uniform(),
    specular: new Uniform(0),
    
    // envMap: samplerCube([
    //     'img/DarkStormy/DarkStormyRight2048.png',
    //     'img/DarkStormy/DarkStormyLeft2048.png',
    //     'img/DarkStormy/DarkStormyUp2048.png',
    //     'img/DarkStormy/DarkStormyDown2048.png',
    //     'img/DarkStormy/DarkStormyFront2048.png',
    //     'img/DarkStormy/DarkStormyBack2048.png'
    // ]),
    // envMap: samplerCube([
    //     'img/space/corona_rt.png',
    //     'img/space/corona_lf.png',
    //     'img/space/corona_up.png',
    //     'img/space/corona_dn.png',
    //     'img/space/corona_bk.png',
    //     'img/space/corona_ft.png'
    // ]),
    //reflectivity: 1
})

var RADIUS = .75;

var blends = [
    new Ray.Sphere({radius: RADIUS}),
    new Ray.Cylinder({height: RADIUS, radius: RADIUS}),
    new Ray.Icosahedron({radius: RADIUS})
].reduceRight( (memo, value) => {
    
    var params = { amount: new Uniform(1) };
    
    if ( memo instanceof Ray.Primitive ) {
        
        return [ new Ray.Blend( params, memo, value ) ];
        
    } else {
        
        memo.unshift( new Ray.Blend( params, memo[ 0 ], value ) );
        
        return memo;
        
    }
    
})

// var blend = new Ray.Blend({amount: new Uniform()}, sphere, octa);
// var torus = new Ray.Torus({ thickness: .2, radius: 1.5, rotation: new THREE.Euler(Math.PI / 2, 0, 0) });
// var squorus = new Ray.Blend({amount: new Uniform(), material}, blend, torus);

var noise = new Ray.Noise({
    speed: new Uniform( vec3(.065, 0, .065) ),
    noiseScale: new Uniform(),
    amount: new Uniform(),
    material
}, blends[0] );

var twist = new Ray.Twist({
    amount: new Uniform(),
    rotation: new Uniform(),
    scale: new Uniform( vec3(1) )
}, noise)

var rotator = new Ray.Rotator({speed: new Uniform(), position: vec3(), scale: new Uniform( vec3(1) )}, twist);

var scene = rotator;

var ray = new Ray.THREERenderer( THREE, scene, {
    lights: [light1],
    background: vec3(0),
    target: new Uniform( vec3() ),
    backgroundAlpha: 0
})

//var controls = new THREE.OrbitControls( ray.camera );

slider('Your national identity makes you feel...', 'Sorry', 'Proud', value => {
    twist.scale.x = twist.scale.y = twist.scale.z = (value + 1) / 3 + 1;
});

slider('Will your country exist in 2000 years?', 'No', 'Yes', value => {
    var v = .75 - value * .25;
    noise.amount = v;
    noise.noiseScale.x = noise.noiseScale.y = noise.noiseScale.z = v;
})

slider('Is your continent heading towards...', 'Utopia', 'Dystopia', value => {
    var v = value * .5 + .5;
    twist.amount = v * 3;
    rotator.speed = v * -2;
})

slider('Is your generation the generation that will finally solve everything?', 'No', 'Yes', value => {
    
    material.specular = value;
    material.specularHardness = value * 512;
    //light1.brightness = 1.5 + value;
    //light1.min = value * .2 + .2;
})

slider('Do you like it when professional ice skaters fall over?', 'No', 'Yes', value => {
    noise.speed.y = value;
})

slider('Would you like science to enhance humans so we never have to sleep?', 'No', 'Yes', value => {
    light1.position.z = value;
    var yellowness = Math.max( value, 0 );
    var blueness = Math.abs( Math.min( value, 0 ) );
    light1.color.b = blueness * .5 + .5;
    light1.color.r = light1.color.g = yellowness * .5 + .5;
});

slider('Would you have a romantic relationship with a robot?', 'No', 'Yes', value => {
    
    value = value * .5 + .5;
    
    value *= blends.length;
    
    blends.forEach( ( b, i ) => {
        
        b.amount = 1 - clamp( value - i );
        
    })
    
    // console.log( blends.map( b => b.amount ) );
})

var screen = ray.shader.resolution;

function screenSize() {
    
    var scale = Math.min( 2 / screen.x, 2 / screen.y );
    
    return {
        w: screen.x * scale,
        h: screen.y * scale,
        scale
    }
    
}

function screenPos ( x, y ) {
    
    var { w, h, scale } = screenSize();
    
    return {
        x: x * scale - 1 + ( 2 - w ) * .5, 
        y: -( y * scale - 1 + ( 2 - h ) * .5 )
    };
    
}

function posAtDistance ( x, y, d ) {
    
    d = d || 0;
    
    var scale = d / ray.shader.fov;
    
    return {
        x: x * scale,
        y: y * scale
    }
    
}

function getCoords( event ) {
    
    if( event.touches ) {
        
        return {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        }
        
    } else {
        
        return {
            x: event.clientX,
            y: event.clientY
        }
        
    }
    
}

var mousedown = false;
var lastBlobX = 0;

function onInputDown ( e ) {
    
    mousedown = true;
    document.body.classList.add('grabbing');
    lastBlobX = posAtDistance( screenPos( getCoords( e ).x, 0 ).x, 0, ray.shader.camera.z ).x;
    
}

function onInputUp ( e ) {
    
    mousedown = false
    document.body.classList.remove('grabbing');
    
}

function onInputMove ( e ) {
    
    var coords = getCoords( e );
    
    var { x, y } = screenPos( coords.x, coords.y );
    
    var z0Pos = posAtDistance( x, y, ray.shader.camera.z );
    
    light1.position.x = z0Pos.x;
    light1.position.y = z0Pos.y;
    
    if ( mousedown ) {
        
        let blobX = z0Pos.x;
        
        let dx = blobX - lastBlobX;
        
        rotator.position.x += dx;
        
        var max = posAtDistance( .6, 0, ray.shader.camera.z ).x
        
        rotator.position.x = clamp( rotator.position.x, -max, max );
        
        lastBlobX = blobX;
        
    }
    
}

window.addEventListener( 'mousedown', onInputDown );
window.addEventListener( 'touchstart', onInputDown );

window.addEventListener('mouseup', onInputUp );
window.addEventListener('touchend', onInputUp );

window.addEventListener( 'mousemove', onInputMove );
window.addEventListener( 'touchmove', onInputMove );