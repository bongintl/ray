var PositionModifier = require('./positionmodifier');

module.exports = class Reflect extends PositionModifier {
    
    name () {
        
        return 'reflect';
        
    }
    
    params () {
        
        return {
            distance: 0
        }
        
    }
    
    write ( p, params ) {
        
        return `vec3( abs( ${p}.x + ${ params.distance } ) - ${ params.distance }, ${p}.yz );`;
        
    }
    
}