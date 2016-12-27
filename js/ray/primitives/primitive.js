var TransformableObject = require('../core/transformableobject');

module.exports = class Primitive extends TransformableObject {
    
    constructor ( params ) {
        
        super( params );
        
        this.glslReturnType = 'float';
        
    }
    
    name () {
        
        return 'primitive';
        
    }
    
}