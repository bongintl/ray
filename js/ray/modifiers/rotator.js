var PositionModifier = require('./positionmodifier.js');

module.exports = class Rotator extends PositionModifier {
    
    name () {
        
        return 'rotator';
        
    }
    
    params () {
        
        return {
            speed: 0
        }
        
    }
    
    declare ( globals ) {
        
        return `
            vec3 rotator( vec3 pos, float speed ) {
                vec3 p = normalize( pos );
                float a = mod( speed * ${globals.time}, PI * 2. );
                float c = cos(a);
                float s = sin(a);
                mat2 m = mat2(c,-s,s,c);
                vec2 xz = m * pos.xz;
                return vec3( xz.x, pos.y, xz.y );
            }
            `;
        
    }
    
    write ( p, params ) {
        
        return `rotator( ${p}, ${params.speed} )`;
        
    }
    
}