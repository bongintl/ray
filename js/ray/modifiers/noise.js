var { vec3 } = require('../core/types');
var DistanceModifier = require('./distancemodifier.js');

module.exports = class Noise extends DistanceModifier {
    
    name () {
        
        return 'noise';
        
    }
    
    params () {
        
        return {
            amount: .2,
            noiseScale: vec3(1),
            speed: vec3(.5)
        }
        
    }
    
    declare ( globals ) {
        
        return `
            float perlin ( vec3 pos, float amount, vec3 scale, vec3 speed ) {
                vec3 p = ( pos + ${ globals.time } * speed ) * scale;
                const vec3 pa = vec3(1., 57., 21.);
                const vec4 pb = vec4(0., 57., 21., 78.);
            	vec3 i = floor(p);
            	vec4 a = dot( i, pa ) + pb;
            	vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
            	a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
            	a.xy = mix(a.xz, a.yw, f.y);
            	return mix(a.x, a.y, f.z) * amount;
            }
        `;
        
    }
    
    write ( p, params, globals ) {
        
        return `perlin( ${ p }, ${ params.amount }, ${ params.noiseScale }, ${ params.speed } )`
        
    }
    
}