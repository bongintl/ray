var Primitive = require('./primitive.js');

module.exports = class Cone extends Primitive {
    
    name () {
        
        return 'cone';
        
    }
    
    params () {
        
        return {
            height: 1,
            radius: 1
        }
        
    }
    
    declare () {
        
        return `
            float cone( vec3 p, float radius, float height ) {
            	vec2 q = vec2(length(p.xz), p.y);
            	vec2 tip = q - vec2(0, height);
            	vec2 mantleDir = normalize(vec2(height, radius));
            	float mantle = dot(tip, mantleDir);
            	float d = max(mantle, -q.y);
            	float projected = dot(tip, vec2(mantleDir.y, -mantleDir.x));
            	
            	// distance to tip
            	if ((q.y > height) && (projected < 0.)) {
            		d = max(d, length(tip));
            	}
            	
            	// distance to base ring
            	if ((q.x > radius) && (projected > length(vec2(height, radius)))) {
            		d = max(d, length(q - vec2(radius, 0)));
            	}
            	return d;
            }`
        
    }
    
    write ( p, params ) {
        
        return `cone( ${p}, ${ params.radius }, ${ params.height } )`;
        
    }
    
};