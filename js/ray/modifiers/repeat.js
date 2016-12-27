var PositionModifier = require('./positionmodifier');
var {vec3} = require('../core/types')

module.exports = class Repeat extends PositionModifier {
    
    name () {
        
        return 'repeat';
        
    }
    
    declare () {
        
        return `
            vec3 repeat( vec3 p, vec3 r ) {
                return mod( p, r ) - .5 * r;
            }
        `;
        
    }
    
    params () {
        
        return {
            repeat: vec3()
        }
        
    }
    
    write ( p, params ) {
        
        return `repeat( ${p}, ${params.repeat} )`;
        
    }
    
}