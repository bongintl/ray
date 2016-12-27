var { vec3, vec4, mat4, composeInverseMatrix } = require('./types');
var Uniform = require('./uniform');
var config = require('../config');
var uniformize = require('../utils/uniformize')

module.exports = class RayObject {
    
    constructor ( params ) {
        
        params = params || {};
        
        var defaults = Object.assign( this.params(), this.transformParams() );
        
        params = Object.assign( {}, defaults, params );
        
        this.uniforms = {};
        
        if( config.allUniforms ) params = uniformize( params );
        
        for ( var paramName in defaults ) {
            
            let param = params[ paramName ];
            
            if ( param instanceof Uniform ) {
                
                if( param.value === undefined ) param.value = defaults[ paramName ];
                
                this.uniforms[ paramName ] = param;
                
                this[ paramName ] = param.value;
                
            } else {
                
                this[ paramName ] = param;
                
            }
            
        }
        
        Object.defineProperty(this, 'isSceneObject', () => {throw new Error('get off')});
        
        this.children = [];
        
        if( params.material ) this.material = params.material;
        if( params.update ) this.update = params.update;
        
    }
    
    params () {
        
        return {};
        
    }
    
    transformParams () {
        
        return {};
        
    }
    
    updateMatrix ( recursive ) {
        
		if ( recursive ) this.children.forEach( c => c.updateMatrix( recursive ) );
		
    }
    
    updateUniforms () {
        
        for ( var prop in this.uniforms ) {
            
            this.uniforms[ prop ].value = this[ prop ];
            
        }
        
    }
    
    traverse ( fn ) {
        
        fn( this );
        
        this.children.forEach( child => child.traverse( fn ) );
        
    }
    
    filter ( fn ) {
        
        var ret = [];
        
        this.children.forEach( child => {
            ret = ret.concat( child.filter( fn ) );
        });
        
        if( fn( this ) ) ret.push( this );
        
        return ret;
        
    }
    
    find ( what ) {
        
        if ( what[0] === '#' ) {
            
            what = what.slice( 1 );
            
            return this.filter( object => object.id == what );
            
        }
        
        
        
    }
    
    traverseDepthFirst ( fn ) {
        
        this.children.forEach( child => child.traverseDepthFirst( fn ) );
        
        fn( this );
        
    }
    
    transformIsStatic () {
        
        var params = this.transformParams();
        
        for ( var param in params ) {
            
            if( this.uniforms[ param ] ) return false;
            
        }
        
        return true;
        
    }
    
}