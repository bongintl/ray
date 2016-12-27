var PositionModifier = require('./positionmodifier.js');

module.exports = class Pull extends PositionModifier {
    
    name () {
        
        return 'pull';
        
    }
    
    params () {
        
        return {
            amount: 0
        }
        
    }
    
    declare () {
        
        return `
            vec3 pull( vec3 pos, float amount ) {
                float dist = pow( 1. - length( pos.xz ), 2. );
                return vec3( pos.x, pos.y + dist * amount, pos.z );
            }
            `;
        
    }
    
    write ( p, params ) {
        
        return `pull( ${p}, ${params.amount} )`;
        
    }
    
}