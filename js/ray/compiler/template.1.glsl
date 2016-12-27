#define PI 3.14159265
#define TAU (2*PI)
#define PHI (sqrt(5.)*0.5 + 0.5)

{{constants}}

{{uniforms}}

float vmax(vec2 v) {
	return max(v.x, v.y);
}

float vmax(vec3 v) {
	return max(max(v.x, v.y), v.z);
}

float vmax(vec4 v) {
	return max(max(v.x, v.y), max(v.z, v.w));
}

vec2 containSquare( vec2 box, vec2 coord ) {
    
    float scale = min( 2. / box.x, 2. / box.y );
    
    vec2 scaledBox = box * scale;
    
    vec2 position = coord * scale - 1.;
    
    position += (vec2(2.) - scaledBox) * .5;
    
    return position;
}

//https://github.com/stackgl/glsl-look-at/blob/gh-pages/index.glsl

mat3 calcLookAtMatrix( vec3 origin, vec3 target, float roll ) {
    vec3 rr = vec3(sin(roll), cos(roll), 0.0);
    vec3 ww = normalize(target - origin);
    vec3 uu = normalize(cross(ww, rr));
    vec3 vv = normalize(cross(uu, ww));
    return mat3(uu, vv, ww);
}

//https://github.com/stackgl/glsl-camera-ray

vec3 getRay( mat3 camMat, vec2 screenPos ) {
    return normalize( camMat * vec3( screenPos, {{fov}} ) );
}
vec3 getRay ( vec2 screenPos ) {
    mat3 camMat = calcLookAtMatrix({{camera}}, {{target}}, 0.0);
    return getRay(camMat, screenPos);
}

vec3 applyMatrix4( mat4 m, vec3 v ) {
    
    return ( m * vec4(v, 1.) ).xyz;
    
}

{{fieldFunctions}}

// float field ( vec3 p ) {
    
// {{fieldVariables}}
    
//     return {{fieldReturn}};
   
// }

//https://github.com/stackgl/glsl-sdf-normal

vec3 normal ( vec3 pos ) {
    
    const vec3 v1 = vec3( 1.0,-1.0,-1.0);
    const vec3 v2 = vec3(-1.0,-1.0, 1.0);
    const vec3 v3 = vec3(-1.0, 1.0,-1.0);
    const vec3 v4 = vec3( 1.0, 1.0, 1.0);
    
    return normalize(
        v1 * field( pos + v1 * {{raymarchPrecision}} ) +
        v2 * field( pos + v2 * {{raymarchPrecision}} ) +
        v3 * field( pos + v3 * {{raymarchPrecision}} ) +
        v4 * field( pos + v4 * {{raymarchPrecision}} )
    );
}

vec3 background( vec3 direction ) {
    
    {{background}}
    
}

{{materialFunctions}}

// vec3 raymarching( vec3 rayOrigin, vec3 rayDir, int reflections );

// vec3 material ( vec3 p, vec3 rayDirection ) {
    
// {{fieldVariables}}
    
//     float dist = {{fieldReturn}};
    
//     if ( dist > {{raymarchPrecision}} ) {
        
//         return background( rayDirection );
        
//     }
    
// {{materials}}
    
    
// }

// vec3 raymarching( vec3 rayOrigin, vec3 rayDir, int reflections ) {

//     float latest = {{raymarchPrecision}} * 2.0;
//     float dist   = 0.0;
//     float type   = -1.0;
//     for (int i = 0; i < {{raymarchSteps}}; i++) {

//         if (latest < {{raymarchPrecision}} || dist > {{raymarchMaximumDistance}}) break;
        
//         latest = max( field( rayOrigin + rayDir * dist ), 0.);
//         dist  += latest;

//     }
    
//     float res = -1.0;
    
//     if ( dist < {{raymarchMaximumDistance}} ) { res = dist; }
    
//     vec3 pos = rayOrigin + rayDir * res;
    
//     return material( pos, rayDir );

// }

void main() {
    
    vec2 screenPos = containSquare( {{resolution}}, gl_FragCoord.xy );

    vec3 rayDirection = getRay( screenPos );
    
    //vec3 color = raymarching( {{camera}}, rayDirection, {{reflections}} );
    
    vec3 rayOrigin = {{camera}};
    vec3 color;
    vec3 worldPosition;
    float dist = {{raymarchPrecision}} * 2.;
    float rayLength = 0.;
    
{{fieldDeclarations}}
    for ( int i = 0; i < {{reflections}}; ++i ) {
        
        for ( int j = 0; j < {{raymarchSteps}}; ++j ) {
            
            worldPosition = rayOrigin + rayDirection * rayLength;
            
{{fieldProcedure}}
            dist = {{fieldResult}};
            
            rayLength += dist;
            
            if ( dist < {{raymarchPrecision}} || rayLength > {{raymarchMaximumDistance}} ) break;
            
        }
        
        color = material( worldPosition, rayDirection );
        
    }
    
    gl_FragColor = vec4( color, 1. );

}