var Primitive = require('./primitive.js');

module.exports = class Sphere extends Primitive {
    
    name () {
        
        return 'sphere';
        
    }
    
    params () {
        
        return {
            radius: 1
        }
        
    }
    
    declare () {
        
        return `
            float sphere( vec3 p, float radius ) {
                return length( p ) - radius;
            }
        `
        
    }
    
    write ( p, params ) {
        
        return `sphere( ${ p }, ${ params.radius } )`;
        
    }
    
};