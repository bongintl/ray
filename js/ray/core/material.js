var { vec3 } = require('../core/types');
var RayObject = require('./rayobject.js');
var Uniform = require('./uniform.js');

module.exports = class Material extends RayObject {
    
    constructor ( params ) {
        
        params = params || {};
        
        if ( params.envMap && !(params.envMap instanceof Uniform) ) {
            
            params.envMap = new Uniform( params.envMap );
            
        }
        
        super( params );
        
    }
    
    name () {
        
        return 'material';
        
    }
    
    params () {
        
        return {
            color: vec3(.3),
            emissive: vec3(0),
            specular: 1,
            envMap: null,
            reflectivity: null,
            refraction: null,
            specularHardness: 128
        }
        
    }
    
    write ( p, rayDirection, lights, params, globals ) {
        
        var reflectRay = !params.envMap && params.reflectivity;
        
        var glsl = [];
        var w = glsl.push.bind(glsl);
        
        if( params.refraction ) {
            
        } else {
            
            w(`
                color += (${ params.color } * ${ globals.ambientLight }) + ${params.emissive} * brightness;
            `)
            
        }
            
        w(`
            float light;
            vec3 lightDir;
            vec3 heading;
            float spec;
            vec3 nor = normal( ${ p } );
        `)
        
        lights.forEach( light => {
            
            // w(`color += ${ light.color } * shadow( ${p}, ${ light.position } );`);
            
            // w(`
            //     lightDir = normalize( ${ light.position } );
            //     light = ${ light.color } * ${ params.color } * clamp( dot( nor, lightDir ), 0., 1. );
            //     heading = normalize( -${ rayDirection } + lightDir );
            //     spec = pow( max( 0.0, dot( heading, nor ) ), ${ params.specularHardness } ) * ${ params.specular };
            //     color += (light + spec) * brightness * shadow( ${p}, ${ light.position } );
            // `)
            w(`
                lightDir = normalize( ${ light.position } - ${ p } );
                light = clamp( dot( nor, lightDir ), ${light.min}, ${light.max} );
                heading = normalize( -${ rayDirection } + lightDir );
                spec = clamp( pow( max( 0.0, dot( heading, nor ) ), ${ params.specularHardness } ), 0., 1.) * ${ params.specular };
                color += (light + spec) * brightness * ${ light.color } * ${ light.brightness } * ${ params.color };
            `)
            
        });
        
        if ( params.envMap ) {
            
            w(`
                vec3 tex = textureCube( ${ params.envMap }, nor ).rgb;
                color += tex * ${ params.reflectivity } * brightness;
            `)
            
        } else if ( params.reflectivity ) {
            
            w(`
                rayDirection = reflect( ${ rayDirection }, nor );
                rayOrigin = ${ p } + rayDirection * .1;
                rayLength = ${ globals.raymarchPrecision } * 2.5;
                dist = ${ globals.raymarchPrecision } * 2.;
                brightness *= ${ params.reflectivity };
                reflections++;
                continue;
            `);
            
        } else if( params.refraction ) {
            
            w(`
                rayOrigin = ${ p } + ${ rayDirection } * ${ globals.raymarchPrecision } * 3.;
                rayDirection = refract( ${ rayDirection }, mix(nor, -nor, inside), mix(${ params.refraction }, 1. / ${ params.refraction }, inside ) );
                rayLength = 0.;
                dist = 0.;
                inside = 1. - inside;
                reflections++;
                continue;
            `)
            
        }
            
        w('break;');
        
        return glsl.join('\n');
        
    }
    
}