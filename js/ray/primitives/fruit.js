var Primitive = require('./primitive.js');

module.exports = class Fruit extends Primitive {
    
    name () {
        
        return 'fruit';
        
    }
    
    params () {
        return {
            q: .25,
            r: .75
        }
    }
    
    declare () {
        
        return `
            float fruit(vec3 p, float q, float r) {
            	p = abs(p);
            	if (p.x < max(p.y, p.z)) p = p.yzx;
            	if (p.x < max(p.y, p.z)) p = p.yzx;
            	float b = max(max(max(
            		dot(p, normalize(vec3(1.))),
            		dot(p.xz, normalize(vec2(PHI+1., 1.)))),
            		dot(p.yx, normalize(vec2(1., PHI)))),
            		dot(p.xz, normalize(vec2(1., PHI))));
            	float l = length(p);
            	return l - 1.5 - 0.2 * r * cos(min(sqrt(1.01 - b / l)*(PI / q), PI));
            }`;
        
    }
    
    write ( p, params ) {
        
        return `fruit( ${p}, ${params.q}, ${params.r} )`;
        
    }
    
};