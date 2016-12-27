var Primitive = require('./primitive.js');

module.exports = class Cylinder extends Primitive {
    
    name () {
        
        return 'cylinder';
        
    }
    
    params () {
        
        return {
            height: 1,
            radius: 1
        }
        
    }
    
    declare () {
        
        return `
            float cylinder( vec3 p, float radius, float height ) {
                float d = length(p.xz) - radius;
                return max(d, abs(p.y) - height);
            }
        `
        
    }
    
    write ( p, params ) {
        
        return `cylinder( ${p}, ${ params.radius }, ${ params.height } )`;
        
    }
    
};