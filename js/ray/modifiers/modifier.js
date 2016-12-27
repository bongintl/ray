var TransformableObject = require('../core/transformableobject');

module.exports = class Modifier extends TransformableObject {
    
    constructor ( params, target ) {
        
        if ( !target ) {
            
            target = params;
            params = {};
            
        }
        
        super( params, target );
        
        this.children[0] = target;
        
    }
    
}