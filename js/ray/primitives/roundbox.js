var { vec3 } = require('../core/types');
var Primitive = require('./primitive.js');

module.exports = class RoundBox extends Primitive {
    
    name () {
        
        return 'roundBox';
        
    }
    
    params () {
        
        return {
            size: vec3(1),
            cornerRadius: .2
        };
        
    }
    
    declare () {
        
        return `
            float roundBox( vec3 p, vec3 size, float cornerRadius ) {
                vec3 d = abs( p ) - size + cornerRadius;
                return length(max(d, vec3(0))) + vmax(min(d, vec3(0))) - cornerRadius;
            }`;
        
    }
    
    write ( p, params ) {
        
        return `roundBox( ${p}, ${ params.size }, ${ params.cornerRadius } )`;
        
    }
    
};