var RayObject = require('./rayobject');
var { getTransform, initObject, composeInverseMatrix } = require('./types');

module.exports = class TransformableObject extends RayObject {
    
    constructor ( params ) {
        
        super( params );
        
        initObject( this );
        
    }
    
    transformParams () {
        
        return getTransform();
        
    }
    
    updateMatrix ( recursive ) {
        
        composeInverseMatrix( this );
        
        super.updateMatrix( recursive );
		
    }
    
    transformIsStatic () {
        
        var params = getTransform();
        
        for ( var param in params ) {
            
            if( this.uniforms[ param ] ) return false;
            
        }
        
        return true;
        
    }
    
}