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

mat3 calcLookAtMatrix( vec3 origin, vec3 target ) {
    const vec3 rr = vec3(0., 1., 0.);
    vec3 ww = normalize(target - origin);
    vec3 uu = normalize(cross(ww, rr));
    vec3 vv = normalize(cross(uu, ww));
    return mat3(uu, vv, ww);
}

vec3 applyMatrix4( mat4 m, vec3 v ) {
    
    return ( m * vec4(v, 1.) ).xyz;
    
}

{{fieldFunctions}}

float field ( vec3 worldPosition ) {
    
{{fieldDeclarations}}

{{fieldProcedure}}

    return {{fieldResult}};
    
}

float raymarch ( const in vec3 rayOrigin, const in vec3 rayDirection ) {
    
    float dist = {{raymarchPrecision}} * 2.5;
    float rayLength = 0.;
    vec3 worldPosition;
    
    for ( int i = 0; i < {{raymarchSteps}}; ++i ) {
        
        if ( abs(dist) < {{raymarchPrecision}} || rayLength > {{raymarchMaximumDistance}} ) break;
        
        worldPosition = rayOrigin + rayDirection * rayLength;
        
        dist = field( worldPosition );
        
        rayLength += dist;
        
    }
    
    return dist;
    
}

vec3 normal ( const in vec3 pos ) {
    
    const vec3 v1 = vec3( 1.0,-1.0,-1.0);
    const vec3 v2 = vec3(-1.0,-1.0, 1.0);
    const vec3 v3 = vec3(-1.0, 1.0,-1.0);
    const vec3 v4 = vec3( 1.0, 1.0, 1.0);
    
    return normalize(
        v1 * field( pos + v1 * 0.002 ) +
        v2 * field( pos + v2 * 0.002 ) +
        v3 * field( pos + v3 * 0.002 ) +
        v4 * field( pos + v4 * 0.002 )
    );
}

float shadow( const in vec3 pos, const in vec3 lightDir ) {
    
    // float d = raymarch( pos, lightDir );
    
    // return step( {{raymarchPrecision}}, d );// * step(fLightDistance, rayLength )
    
    vec3 dir = normalize( lightDir );
    float shadow = 1.;
    float rayLength = {{raymarchPrecision}} * 2.5;
    float dist;
    
    for( int i = 0; i < {{shadowSteps}}; ++i ) {
        
        dist = field( pos + dir * rayLength );
        
        if( dist < {{raymarchPrecision}} ) return 0.;
        
        shadow = min( shadow, 16. * dist / rayLength );
        
        rayLength += dist;
        
        if( rayLength > {{raymarchMaximumDistance}} ) break;
        
    }
    
    return shadow;
    
    // float res = 1.0;
    // for( float t=mint; t < maxt; )
    // {
    //     float h = map(ro + rd*t);
    //     if( h<0.001 )
    //         return 0.0;
    //     res = min( res, k*h/t );
    //     t += h;
    // }
    // return res;
    
}

vec3 background( const in vec3 direction ) {
    
    {{background}}
    
}

{{materialFunctions}}

void main() {
    
    mat3 camMat = calcLookAtMatrix( {{camera}}, {{target}} );
    
    vec2 screenPos = containSquare( {{resolution}}, gl_FragCoord.xy );
    
    vec3 rayDirection = normalize( camMat * vec3( screenPos, {{fov}} ) );
    
    vec3 rayOrigin = {{camera}};
    vec3 color = vec3(0.);
    vec3 worldPosition;
    float dist = {{raymarchPrecision}} * 2.;
    float rayLength = 0.;
    float brightness = 1.;
    
    vec3 fluidColor = {{air}};
    float fluidDensity = {{airDensity}};
    
    float alpha = 1.;
    
    int reflections = 0;
    int steps = 0;
    float inside = 0.;
    
{{fieldDeclarations}}
    for ( int i = 0; i < {{reflectionSteps}}; ++i ) {
        
        for ( int j = 0; j < {{raymarchSteps}}; ++j ) {
            
            worldPosition = rayOrigin + rayDirection * rayLength;
            
            if ( dist < {{raymarchPrecision}} ) break;
            
{{fieldProcedure}}
            dist = {{fieldResult}};
            
            rayLength += dist;
            
            steps++;
            
        }
        
        if ( dist > {{threshold}} ) {
            
            color = background( rayDirection ) * brightness;
            alpha = {{backgroundAlpha}};
            break;
            
        }
        
        color = mix( color, fluidColor, fluidDensity * rayLength / {{raymarchMaximumDistance}});
        
        #if 0
        
        color = vec3( float(steps) / float({{raymarchSteps}}) );
        
        #else
        
        {{materials}}
        
        #endif
        
    }
    
    if ( reflections == {{reflectionSteps}} ) {
        color += background( rayDirection ) * brightness;
    }
    
    float bw = ( color.r + color.g + color.b ) / 3.; // light value
    color -= bw; // pure colour values
    color *= 0.8; // desaturate
    color += vec3( .08, .08, -.08 ) * ( bw - .4 ) + bw;
    
    gl_FragColor = vec4( color, alpha );

}