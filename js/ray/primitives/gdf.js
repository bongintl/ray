var Primitive = require('./primitive');

var v3s = [
	'normalize(vec3(1., 0., 0.))',
	'normalize(vec3(0., 1., 0.))',
	'normalize(vec3(0., 0., 1.))',

	'normalize(vec3(1., 1., 1. ))',
	'normalize(vec3(-1., 1., 1.))',
	'normalize(vec3(1., -1., 1.))',
	'normalize(vec3(1., 1., -1.))',

	'normalize(vec3(0., 1., PHI+1.))',
	'normalize(vec3(0., -1., PHI+1.))',
	'normalize(vec3(PHI+1., 0., 1.))',
	'normalize(vec3(-PHI-1., 0., 1.))',
	'normalize(vec3(1., PHI+1., 0.))',
	'normalize(vec3(-1., PHI+1., 0.))',

	'normalize(vec3(0., PHI, 1.))',
	'normalize(vec3(0., -PHI, 1.))',
	'normalize(vec3(1., 0., PHI))',
	'normalize(vec3(-1., 0., PHI))',
	'normalize(vec3(PHI, 1., 0.))',
	'normalize(vec3(-PHI, 1., 0.))',
];

function gdf ( name, begin, end ) {
    
    return class extends Primitive {
        
        name () {
            
            return name;
            
        }
        
        params () {
            
            return {
                radius: 1
            }
            
        }
        
        declare () {
            
            var glsl = `
                float ${name}( vec3 p, float r ) {
                    float d = 0.;
            `
            
            for ( var i = begin; i <= end; i++ ) {
                
                glsl += `d = max( d, abs( dot( p, ${ v3s[i] } ) ) );\n`;
                
            }
            
            glsl += `
                    return d - r;
                }
            `;
            
            return glsl;
            
        }
        
        write ( p, params ) {
            
            return `${name}( ${ p }, ${ params.radius } );`;
            
        }
        
    }
    
}

module.exports = {
    Octahedron: gdf('octahedron', 3, 6),
    Dodecahedron: gdf('dodecahedron', 13, 18),
    Icosahedron: gdf('icosahedron', 3, 12),
    TruncatedOctahedron: gdf('truncatedOctahedron', 0, 6),
    TruncatedIcosahedron: gdf('truncatedIcosahedron', 3, 18),
};