var Modifier = require('./modifier');

module.exports = class PositionModifier extends Modifier {
    
    constructor( params, target ) {
        
        if ( !target ) {
            
            target = params;
            params = {};
            
        }
        
        super( params, target );
        
        this.children[0] = target;
        
        this.glslReturnType = 'vec3';

    }
    
    name () {
        
        return 'pModifier';
        
    }
    
}