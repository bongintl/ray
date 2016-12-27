var { vec3 } = require('../core/types');
var Primitive = require('./primitive.js');

module.exports = class Box extends Primitive {
    
    name () {
        
        return 'box';
        
    }
    
    params () {
        
        return {
            size: vec3(1)
        };
        
    }
    
    declare () {

        return `
            float box( vec3 p, vec3 size ) {
	            vec3 d = abs(p) - size;
            	return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
            }`;
        
    }
    
    write ( p, params ) {
        
        return `box( ${p}, ${params.size} )`;
        
    }
    
};