var { vec3 } = require('../core/types');
var PositionModifier = require('./positionmodifier');

module.exports = class Voxel extends PositionModifier {
    
    name () {
        
        return 'voxel';
        
    }
    
    declare () {
        
        return `
            vec3 voxel( vec3 p, vec3 size ) {
                return floor( p / size ) * size;
            }
        `;
        
    }
    
    params () {
        
        return {
            size: vec3(.2)
        }
        
    }
    
    write ( p, params ) {
        
        return `voxel( ${p}, ${params.size} )`;
        
    }
    
}