var Primitive = require('./primitive.js');

module.exports = class Torus extends Primitive {
    
    name () {
        
        return 'torus';
        
    }
    
    params () {
        
        return {
            radius: .75,
            thickness: .5,
        }
        
    }
    
    declare () {
        
        return `
            float torus( vec3 p, float radius, float thickness ) {
	            return length(vec2(length(p.xz) - radius, p.y)) - thickness;
            }
        `
        
    }
    
    write ( p, params ) {
        
        return `torus( ${p}, ${ params.radius }, ${ params.thickness } )`;
        
    }
    
};