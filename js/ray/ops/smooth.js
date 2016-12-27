var Op = require('./op.js');

module.exports = class Smooth extends Op {
    
    name() {
        
        return 'smooth';
        
    }
    
    params () {
        
        return {
            amount: .1
        }
        
    }
    
    declare () {
        
        return `
            float smin ( float a, float b, float k ) {
                float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
                return mix( b, a, h ) - k*h*(1.0-h);
            }
        `;
        
    }
    
    write ( left, right, params ) {
        
        return `smin(${ left }, ${ right }, ${ params.amount })`;
        
    }

    
};