var PositionModifier = require('./positionmodifier.js');

module.exports = class Twist extends PositionModifier {
    
    name () {
        
        return 'twist';
        
    }
    
    params () {
        
        return {
            amount: 0
        }
        
    }
    
    declare () {
        
        return `
            vec3 twist( vec3 pos, float amount ) {
                vec3 p = normalize( pos );
                float c = cos(amount * p.y);
                float s = sin(amount * p.y);
                mat2 m = mat2(c,-s,s,c);
                vec2 xz = m * pos.xz;
                return vec3( xz.x, pos.y, xz.y );
            }
            `;
        
    }
    
    write ( p, params ) {
        
        return `twist( ${p}, ${params.amount} )`;
        
    }
    
}