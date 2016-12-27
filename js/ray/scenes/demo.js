var slider = require('./lib/sliders');
var slowMouse = require('./lib/slowMouse');
var THREE = require('three');
require('../vendor/three.orbitcontrols.js');
var Ray = require('../ray.js');
var clamp = require('../../lib/clamp');
var scale = require('../../lib/scale');
var tween = require('./lib/tween');
var Promise = require('promise');

Ray.types.use( 'THREE', THREE );

var Uniform = Ray.Uniform;
var { vec2, vec3, samplerCube } = Ray.types;

var light1 = new Ray.Light({
    position: new Uniform( vec3( 0, 9, 8 ) ),
    color: new Uniform( new THREE.Color(.8, .8, .8) ),
    brightness: new Uniform(),
    min: new Uniform()
})

var material = new Ray.Material({
    color: new Uniform( vec3(1) ),
    specularHardness: new Uniform(),
    specular: new Uniform(0)
})

var RADIUS = .6;

var sphere = new Ray.Sphere( { radius: RADIUS } );

var noise = new Ray.Noise({
    position: new Uniform(),
    speed: new Uniform( vec3(.1, 0, .1) ),
    noiseScale: new Uniform(),
    amount: new Uniform(),
    material
}, sphere );

var scene = noise;

var ray = new Ray.THREERenderer( THREE, scene, {
    lights: [light1],
    background: vec3(0),
    target: new Uniform( vec3() ),
    backgroundAlpha: 0
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

var mousedown = false;
var lastBlobX = 0;

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

var question = document.querySelector('.question');
var questionText = document.querySelector('.question__text_question');

var dragHint = document.querySelector('.question__text_drag');
var ok = document.querySelector('.question__text_ok');

var answers = [
    document.querySelector('.question__text_answer-1'),
    document.querySelector('.question__text_answer-2')
];

function onInputDown ( e ) {
    
    mousedown = true;
    document.body.classList.add('grabbing');
    lastBlobX = posAtDistance( screenPos( getCoords( e ).x, 0 ).x, 0, ray.shader.camera.z ).x;
    dragHint.style.opacity = 0;
    
}

function onInputUp ( e ) {
    
    mousedown = false;
    document.body.classList.remove('grabbing');
    ok.style.opacity = 1;
    
}

var currQuestion = 0;
var answer = 0;

var isTouch = 'ontouchstart' in window;

function onInputMove ( e ) {
    
    var coords = getCoords( e );
    
    var { x, y } = screenPos( coords.x, coords.y );
    
    var z0Pos = posAtDistance( x, y, ray.shader.camera.z );
    
    if( !isTouch ) {
    
        light1.position.x = z0Pos.x;
        light1.position.y = z0Pos.y;
    
    }
    
    if ( mousedown ) {
        
        let blobX = z0Pos.x;
        
        let dx = blobX - lastBlobX;
        
        scene.position.x += dx;
        
        var max = posAtDistance( .75, 0, ray.shader.camera.z ).x
        
        scene.position.x = clamp( scene.position.x, -max, max );
        
        lastBlobX = blobX;
        
        answers[0].style.opacity = scale( scene.position.x, 0, max, 1, .1 );
        
        answers[1].style.opacity = scale( scene.position.x, 0, -max, 1, .1 );
        
        answer = clamp( x / .75, -1, 1 );
        
    }
    
}

window.addEventListener( 'mousedown', onInputDown );
window.addEventListener( 'touchstart', onInputDown );

window.addEventListener('mouseup', onInputUp );
window.addEventListener('touchend', onInputUp );

window.addEventListener( 'mousemove', onInputMove );
window.addEventListener( 'touchmove', e => {
    e.preventDefault();
    onInputMove(e);
});

var TRANSFORM_DURATION = 5000;
var DELAY = 2000;
var PAN_DURATION = 2000;

var blobTransforms = [

    [
        amount => {
            
            return tween( TRANSFORM_DURATION, 'quartInOut', x => {
                noise.noiseScale.x = scale( x, 0, 1, 1, 2 )
                noise.noiseScale.y = noise.noiseScale.z = scale( x, 0, 1, 1, .5 );
                noise.amount = scale( x, 0, 1, .2, .9 );
            })
            
        },
        
        amount => {
            
            return tween( TRANSFORM_DURATION, 'quartInOut', x => {
                noise.noiseScale.y = scale( x, 0, 1, 1, 2 )
                noise.noiseScale.x = noise.noiseScale.z = scale( x, 0, 1, 1, .5 );
                noise.amount = scale( x, 0, 1, .2, .9 );
            })
            
        }
    
    ],
    
    [
        
        amount => {
            
            return tween( TRANSFORM_DURATION, 'quartInOut', x => {
                
                material.specular = x * amount;
                material.color.y = 1 - x * amount;
                
                console.log( amount );
                
            })
            
        },
        
        amount => {
            
            return tween( TRANSFORM_DURATION, 'quartInOut', x => {
            
                material.specular = x * amount;
                material.color.z = 1 - x * amount;
            
            })
            
        }
        
    ]

];

ok.addEventListener('click', () => {
    
    var answerIndex = answer > 0 ? 1 : 0;
    var answerAmount = answerIndex === 0 ? -answer : answer;
    
    var fadeOutAnswer = answers[ 1 - answerIndex ];
    
    ok.style.opacity = 0;
    
    new Promise( resolve => {
        
        tween( Number( fadeOutAnswer.style.opacity ), 0, TRANSFORM_DURATION, x => fadeOutAnswer.style.opacity = x ),
        blobTransforms[ currQuestion ][ answerIndex ]( answerAmount );
        
        setTimeout( resolve, TRANSFORM_DURATION - DELAY );
        
    }).then(() => {
        
        tween( scene.position.x, 0, PAN_DURATION, 'quartInOut', x => scene.position.x = x );
        
        tween( 0, answer * -37.5, PAN_DURATION, 'quartInOut', x => {
            
            question.style.transform = `translate(${x}%, 0)`;
            
        })
        
        return tween( 2, 0, PAN_DURATION, x => question.style.opacity = x );
        
    }).then(() => {
        
        if( currQuestion === 1 ) return;
        
        questionText.innerText = 'The idea of a continent like Europe is';
        
        answers[0].innerText = 'Ridiculous';
        answers[1].innerText = 'Inspiring';
        
        answers[0].style.opacity = answers[1].style.opacity = 1;
        
        question.style.transform = 'none';
        
        answer = 0;
        
        currQuestion++;
        
        tween( PAN_DURATION, x => question.style.opacity = x );
        
    })
    
})

document.addEventListener( 'scroll', e => e.preventDefault() );