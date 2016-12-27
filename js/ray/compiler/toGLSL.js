var THREE = require('three');

function int( number ) {
    
    return String( number );
    
}

function float ( number ) {
    
    if ( Math.floor( number ) === number ) return number + '.';
    
    return String( number );
    
}

function vec2 ( v ) {
    
    return `vec2(${ float(v.x) }, ${ float(v.y) })`;
    
}

function vec3 ( v ) {
    
    var { x, y, z } = v;
    
    if ( v instanceof THREE.Color ) {
        
        x = v.r;
        y = v.g;
        z = v.b;
        
    }
    
    return `vec3(${ float(x) }, ${ float(y) }, ${ float(z) })`;
    
}

function vec4 ( v ) {
    
    return `vec4(${ float(v.x) }, ${ float(v.y) }, ${ float(v.z) }, ${ float(v.w) })`;
    
}

function mat4( m ) {
    
    return `mat4(${m.toArray().map(float).join(', ')})`;
    
}

var fns = { float, vec2, vec3, vec4, mat4 };

function GLSLType ( x ) {
    
    if( Array.isArray(x) ) return GLSLType( x[0] );
    
    if ( x === true || x === false ) return 'bool';
    
    if ( !isNaN( x ) && typeof x === 'string' ) return 'int';
    
    if ( !isNaN( x ) ) return 'float';
    
    if ( x instanceof THREE.CubeTexture ) return 'samplerCube';
    
    if ( x instanceof THREE.Texture ) return 'sampler2D';
    
    if ( x instanceof THREE.Vector2 ) return 'vec2';
    
    if (
        x instanceof THREE.Vector3 ||
        x instanceof THREE.Euler ||
        x instanceof THREE.Color
    ) return 'vec3';
    
    if ( x instanceof THREE.Quaternion ) return 'vec4';
    
    if ( x instanceof THREE.Matrix4 ) return 'mat4';
    
    console.warn("Couldn't convert type to GL:", x);
    
    return undefined;
    
}

function toGLSL ( x, type ) {
    
    if( Array.isArray(x) ) {
        
        return '[' + x.map( v => v.toGLSL(v, type) ).join(', ') + ']';
        
    } else {
        
        return fns[ type || GLSLType(x) ]( x );
        
    }
    
}

module.exports = { GLSLType, toGLSL };