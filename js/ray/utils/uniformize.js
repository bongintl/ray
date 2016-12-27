var { GLType } = require('../core/types');
var Uniform = require('../core/uniform');
var isFunction = require('lodash/isFunction');

module.exports = function uniformize ( obj, exceptions ) {
    
    exceptions = exceptions || [];
    
    for( var key in obj ) {
        
        var x = obj[ key ];
        
        if (
            exceptions.indexOf(key) === -1 &&
            x !== null &&
            !(x instanceof Uniform) &&
            !isFunction( x ) &&
            GLType( x ) !== undefined
        ) {
            obj[ key ] = new Uniform( x );
        }
        
    }
    
    return obj;
    
}