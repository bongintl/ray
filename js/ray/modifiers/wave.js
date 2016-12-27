var Modifier = require('./modifier.js');

module.exports = class Wave extends Modifier {
    
    name () {
        
        return 'wave';
        
    }
    
    declare ( globals ) {
        
        return `
            vec3 wave( vec3 pos, float freq, float amp, float speed ) {
                vec3 p = vec3( pos );
                float w = p.y + ${ globals.time } * speed;
                p.x += sin( w * freq ) * amp;
                return p;
            }
        `;
        
    }
    
    params () {
        
        return {
            amplitude: 1,
            frequency: 3,
            speed: 0
        }
        
    }
    
    write ( p, params ) {
        
        return `wave( ${ p }, ${ params.frequency }, ${ params.amplitude }, ${ params.speed } )`;
        
    }
    
}