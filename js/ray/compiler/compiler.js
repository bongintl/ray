var { vec2, vec3, color } = require('../core/types');

var Uniform = require('../core/uniform');

var Primitive = require('../primitives/primitive');
var Material = require('../core/material');
var Op = require('../ops/op');
var DistanceModifier = require('../modifiers/distancemodifier');
var PositionModifier = require('../modifiers/positionmodifier');
var Light = require('../core/light');
var config = require('../config');
var uniformize = require('../utils/uniformize');
var capitalize = require('../utils/capitalize');

var { GLSLType, toGLSL } = require('./toGLSL');
var template = require('./template.glsl');

function pushIfUnique( array, value ) {
    
    if ( Array.isArray( value ) ) value.forEach( v => pushIfUnique( array, v ) );
    
    if ( array.indexOf( value ) === -1 ) array.push( value );
    
}

function declarer ( collection, prefix, reuse, count ) {
    
    count = count || {};
    
    return function ( value, name, type ) {
        
        type = type || GLSLType( value );
        
        if( !name ) name = type;
        
        var isGLSL = typeof value === 'string';
        
        var glslValue = isGLSL ? value : toGLSL( value );
        
        if ( isGLSL || reuse ) {
            
            var exists = collection.find( u => u.glslValue === glslValue );
            
            if ( exists ) return exists.glslName;
            
        }
        
        if( !count[ name ] ) count[ name ] = 0;
        
        var glslName = prefix || '';
        
        glslName += name + count[ name ];
        
        count[ name ]++;
        
        collection.push( { type, glslName, glslValue } );
        
        return glslName;
        
    }
    
}

function uniformDeclarer ( collection, prefix ) {
    
    var count = {};
    
    return function ( object, property, name ) {
        
        name = name || property;
        
        if( !count[ name ] ) count[ name ] = 0;
        
        var glslName = prefix || '';
        
        glslName += name + count[ name ];
        
        count[ name ]++;
        
        collection[ glslName ] = { glslName, owner: object, property };
        
        return glslName;
        
    }
    
}

function writeVariables ( list, qualifier, indent ) {
    
    if( list.length === 0 ) return '';
    
    return list.map( v => {

        var str = '';
        
        for ( var i = 0; i < indent; i++ ) str += '\t';
        
        if ( qualifier ) str = qualifier + ' ';
        
        return str + v.type + ' ' + v.glslName + ' = ' + v.glslValue;
        
    }).join(';\n') + ';';
    
}

function writeUniforms ( uniforms ) {
    
    var ret = '';
    
    for ( var name in uniforms ) {
        
        let uniform = uniforms[ name ];
        
        let value = uniform.owner[ uniform.property ];
        
        var type = GLSLType( value );
        
        if ( type === undefined ) throw new Error("Couldn't get type of uniform " + uniform.glslName);
        
        ret += 'uniform ' + type + ' ' + uniform.glslName;
        
        ret += ';\n';
        
    }
    
    return ret;
    
}

var uniformExceptions = [ 'raymarchSteps', 'reflectionSteps', 'shadowSteps', 'lights' ];

module.exports = class Shader {
    
    constructor ( scene, options ) {
        
        if( !scene.material ) scene.material = new Material();
        
        var globals = {};
        var fieldFunctions = [];
        var materialFunctions = [];
        var uniforms = {};
        var constants = [];
        var variables = [];
        var materials = {};

        var declareUniform = uniformDeclarer( uniforms, 'u_' );
        var declareConstant = declarer( constants, 'c_', true );
        
        var declareVariable = declarer( variables, null, null, {p:1} );
        
        options = Object.assign( {}, this.defaults(), options || {} );
        
        if ( config.allUniforms ) options = uniformize( options, uniformExceptions );
        
        Object.assign( this, options );
        
        var lights = this.lights.map( light => {
            
            var params = light.params();
            var glsl = {};
            
            for( var key in params ) {
                
                var glslName = 'light' + capitalize( key );
                
                if ( key in light.uniforms ) {
                    
                    glsl[ key ] = declareUniform( light, key, glslName );
                    
                } else {
                    
                    glsl[ key ] = declareConstant( light[ key ], glslName );
                    
                }
                
            }
            
            return glsl;
            
        });
        
        for ( var key in options ) {
            
            if ( key === 'lights' ) continue;

            var option = this[ key ];
            
            if ( option instanceof Uniform ) {
                
                this[ key ] = this[ key ].value;
                
                globals[ key ] = declareUniform( this, key )
                
            } else if ( GLSLType( option ) === 'sampler2D' || GLSLType( option ) === 'samplerCube' ) {
                
                globals[ key ] = declareUniform( this, key )
                
            } else {
                
                globals[ key ] = declareConstant( option, key );
                
            }
            
        }
        
        switch( GLSLType( this.background ) ) {
            
            case 'samplerCube':
                globals.background = `return textureCube( ${ globals.background }, direction ).xyz;`;
                break;
                
            case 'sampler2D':
                globals.background = `
                    vec2 screenPos = containSquare( ${ globals.resolution }, gl_FragCoord.xy );
                    return texture2D( ${ globals.background }, screenPos * .5 + .5 ).xyz;
                `;
                break;
                
            case 'vec3':
                globals.background = `return ${ globals.background };`;
                break;
            
        }
        
        var identity = declareConstant( 'mat4(1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1., 0., 0., 0., 0., 1.)', 'identity', 'mat4' );
        
        function declareParams( item ) {
            
            var params = item.params();
            
            var glslParams = {};
            
            for ( var paramName in params ) {
                
                let prop = item[ paramName ];
                let glslName = item.name() + capitalize( paramName );
                
                if ( prop === null ) {
                    
                    continue;
                    
                } if( paramName in item.uniforms ) {
                    
                    glslParams[ paramName ] = declareUniform( item, paramName, glslName );
                    
                } else {
                    
                    glslParams[ paramName ] = declareConstant( prop, glslName );
                    
                }
                
            }
            
            return glslParams;
            
        }
        
        function applyMatrix ( item, p ) {
            
            var glslMatrix;
            
            if ( item.transformIsStatic() ) {
                
                glslMatrix = declareConstant( item.matrixInverse, item.name() + 'Matrix' );
                
            } else {
                
                glslMatrix = declareUniform( item, 'matrixInverse', item.name() + 'Matrix' );
                
            }
            
            if ( glslMatrix !== identity ) {
            
                p = declareVariable( `applyMatrix4( ${glslMatrix}, ${p} )`, 'p' + capitalize( item.name() ), 'vec3' );
            
            }
            
            return p;
            
        }
        
        function writeObject ( item, p ) {
            
            item.updateMatrix();
            
            if ( item.declare ) pushIfUnique( fieldFunctions, item.declare( globals ) );
            
            var glslParams = declareParams( item );
            
            var glsl, name;
            
            if ( item instanceof PositionModifier ) {
                
                name = 'p' + capitalize( item.name() );
                
                p = declareVariable( item.write( p, glslParams ), name, 'vec3' );
                
                p = applyMatrix( item, p );
                
                return writeObject( item.children[0], p );
                
            } else {
                
                p = applyMatrix( item, p );
                
                var children = item.children.map( child => writeObject( child, p ) );
                
                if ( item instanceof Primitive ) {
                    
                    name = item.name();
                    
                    glsl = item.write( p, glslParams, globals );
                    
                } else if ( item instanceof Op ) {
                    
                    name = item.name() + capitalize( item.children[0].name() ) + 'And' + capitalize( item.children[1].name() );
                    
                    glsl = item.write( children[0], children[1], glslParams, globals );
                    
                } else if ( item instanceof DistanceModifier ) {
                    
                    name = item.name() + capitalize( item.children[0].name() );
                    
                    var mod = declareVariable( item.write( p, glslParams, globals ), item.name(), 'float' );
                    
                    glsl = `${ children[0] } + ${ mod }`;
                    
                }
                
                var distVar = declareVariable( glsl, name, item.glslReturnType );
                
                if ( item.material ) {
                    
                   materials[ distVar ] = item.material;
                    
                }
                
                return distVar;
    
            }
            
        }
        
        var glslFieldResult = writeObject( scene, 'worldPosition', true );
        
        var glslMaterials = [];
        
        for ( var distVar in materials ) {
            
            var material = materials[ distVar ];
            
            if ( material.declare ) pushIfUnique( materialFunctions, material.declare( globals ) );
            
            var params = declareParams( material );
            
            var glsl = `if ( dist > ${ distVar } - ${ globals.raymarchPrecision } ) {\n`;
            
            glsl += material.write( 'worldPosition', 'rayDirection', lights, params, globals );
            
            glsl += '\n}\n'
            
            glslMaterials.push( glsl );
            
        }
        
        glslMaterials = glslMaterials.join('\n');
        
        var glslFieldFunctions = fieldFunctions.join('\n\n');
        var glslMaterialFunctions = materialFunctions.join('\n\n');
        var glslUniforms = writeUniforms( uniforms );
        var glslConstants = writeVariables( constants, 'const', 0 );
        var glslFieldVariables = writeVariables( variables, null, 1 );
        
        var glslFieldDeclarations = variables.map( v => `\t${v.type} ${v.glslName};\n` ).join('');
        var glslFieldProcedure = variables.map( v => `\t\t\t${v.glslName} = ${v.glslValue};\n` ).join('');
        
        var shaderParams = Object.assign( {}, globals, {
            uniforms: glslUniforms,
            constants: glslConstants,
            fieldFunctions: glslFieldFunctions,
            fieldVariables: glslFieldVariables,
            fieldDeclarations: glslFieldDeclarations,
            fieldProcedure: glslFieldProcedure,
            fieldResult: glslFieldResult,
            materialFunctions: glslMaterialFunctions,
            materials: glslMaterials
        })
        
        var shader = template( shaderParams );
        
        this.scene = scene;
        
        this.glsl = shader;
        this.uniforms = uniforms;
        
        this.lastTime = Date.now();
        
        this.updatimgItems = [];
        
        this.scene.traverse( item => {
            
            if( item.update ) this.updatimgItems.push( item );
            
        })
        
        console.log(this.glsl);
    
    }
    
    setSize ( w, h ) {
        
        this.resolution.x = w;
        this.resolution.y = h;
        
    }
    
    update () {
        
        this.scene.updateMatrix( true );
        
        var now = Date.now();
        
        this.time += ( now - this.lastTime ) * .001;
        
        this.lastTime = now;
        
        for ( var name in this.uniforms ) {
            
            var u = this.uniforms[ name ]
            
            u.value = u.owner[ u.property ];
            
        }
        
        this.updatimgItems.forEach( i => i.update(i, this) );
        
    }
    
    defaults () {
        
        return {  
            background: vec3( 0 ),
            backgroundAlpha: 1,
            ambientLight: 0,
            lights: [
                new Light({
                    position: vec3( 7.5, 10, 5 ),
                    color: vec3( 1 )
                })
            ],
            camera: vec3( 0, 0, 5 ),
            target: vec3(),
            resolution: new Uniform( vec2() ),
            time: new Uniform( Math.random() * 100 ),
            fov: Math.sqrt(2),
            raymarchPrecision: .001,
            raymarchMaximumDistance: 7,
            raymarchSteps: '20',
            shadowSteps: '40',
            reflectionSteps: '3',
            air: vec3(),
            airDensity: 0,
            threshold: 5
        }
    
    }
    
}