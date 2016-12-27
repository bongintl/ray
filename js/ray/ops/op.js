var TransformableObject = require('../core/transformableobject');

var isPlainObject = require('lodash/isPlainObject');

module.exports = class Op extends TransformableObject {
    
    constructor( ...args ) {
        
        var params, children;
        
        if( isPlainObject( args[0] ) ) {
            
            params = args[ 0 ];
            children = args.slice(1);
            
        } else {
            
            params = {};
            children = args;
            
        }
        
        super( params );
        
        if( children.length < 2 ) {
            
            throw new Error( 'Not enough arguments to ' + this.name() );
            
        } else if( children.length === 2 ) {
            
            this.children = children;
            
        } else {
            
            this.children[0] = children[0];
            
            this.children[1] = new this.constructor( params, ...children.slice(1) );
            
        }
        
        this.glslReturnType = 'float';
        
    }
    
    name () {
        
        return 'op';
        
    }
    
}