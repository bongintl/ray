var Modifier = require('./modifier');
var PositionModifier = require('./positionmodifier');

module.exports = class DistanceModifier extends Modifier {
    
    constructor( params, target ) {
        
        super( params, target );
        
        var child = this.children[0];
        
        while ( child instanceof PositionModifier ) {
            
            child = child.children[ 0 ];
            
        }
        
        if ( child.material ) {
            
            this.material = child.material;
            
            child.material = null;
            
        }
        
        this.glslReturnType = 'float';
        
    }
    
    name () {
        
        return 'dModifier';
        
    }
    
}