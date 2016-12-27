var isFunction = require('lodash/isFunction');
var isEqual = require('lodash/isEqual');
var capitalize = require('../utils/capitalize');

var defs;

var vectorTypeNames = ['vec2', 'vec3', 'vec4'];
var matrixTypeNames = ['mat4'];
var textureTypeNames = ['sampler2D', 'samplerCube'];
var typeNames = vectorTypeNames.concat( matrixTypeNames ).concat( textureTypeNames );

var types = module.exports = {
    use,
    vectorTypeNames,
    matrixTypeNames,
    textureTypeNames,
    typeNames,
    is,
    vec2: vectorCreator(2, 'vec2'),
    vec3: vectorCreator(3, 'vec3'),
    vec4: vectorCreator(4, 'vec4'),
    mat4: matrixCreator(4, 4, 'mat4'),
    sampler2D: createSampler2D,
    samplerCube: createSamplerCube,
    GLType,
    GLValue,
    composeInverseMatrix: obj => defs.composeInverseMatrix( obj ),
    getTransform: () => defs.getTransform(),
    initObject: obj => defs.initObject && defs.initObject(obj)
}

typeNames.forEach( type => {
    
    types[ 'is' + capitalize( type ) ] = is.bind( null, type );
    
});

var plugins = {
    THREE: require('../three/types')
}

function use ( ...args ) {
    
    var newDefs;
    
    if ( typeof args[0] === 'string' ) {
        
        var plugin = plugins[ args[0] ];
        
        if ( isFunction( plugin ) ) {
            
            newDefs = plugin( ...args.slice( 1 ) );
            
        } else {
            
            newDefs = plugin;
            
        }
        
    } else {
        
        newDefs = args[0];
        
    }
    
    ['create', 'test', 'toArray'].forEach( prop => {
        
        var def = newDefs[ prop ];
        
        if ( isFunction( def ) ) {
            
            var obj = {};
            
            typeNames.forEach( name => obj[ name ] = def );
            
            newDefs[ prop ] = obj;
            
        } else {
            
            typeNames.forEach( type => {
                
                if( !( type in def ) ) throw new Error(`Missing ${prop} function for type ${type}`);
                
            });
            
        }
        
    });
    
    if( !( 'composeInverseMatrix' in newDefs ) ) throw new Error('Missing composeInverseMatrix function');
    
    if( !( 'getTransform' in newDefs ) ) throw new Error('Missing getTransform function');
    
    defs = newDefs;
    
}

function GLType ( x ) {
    
    if ( !isNaN( x ) ) return typeof x === 'string' ? 'int' : 'float';
    
    for ( var typeName of typeNames ) {
        
        if ( defs.test[ typeName ]( x ) ) return typeName;
        
    }
    
    return undefined;
    
}

function is ( x, what ) {
    
    return defs.test[ what ]( x );
    
}

function writeFloat( x ) {
    
    return Math.floor( x ) === x ? x + '.0' : x;
    
}

function GLValue ( x ) {
    
    var type = GLType( x );
    
    if ( type in textureTypeNames ) throw new Error("Can't write the value of a texture");
    
    if ( type === 'int' ) return x;
    
    if ( type === 'float' ) return writeFloat( x );
    
    var arr = defs.toArray[ type ]( x );
    
    return type + '(' + arr.map( writeFloat ).join(', ') + ')';
    
}

function components ( num, type, ...args ) {
    
    var ret = [];
    
    if ( args.length === 0 ) args = [0];
    
    if ( args.length === 1 && !isNaN( args[0] ) ) {
        
        for ( var i = 0; i < num; i++ ) ret.push( args[0] );
        
        return ret;
        
    }
    
    for ( var i = 0; i < args.length; i++ ) {
        
        var arg = args[ i ];
        
        if ( !isNaN( arg ) ) {
            
            ret.push( arg );
            
        } else {
            
            ret = ret.concat( defs.toArray[ type ]( arg ) );
            
        }
        
    }
    
    if ( ret.length !== num ) {
        
        throw new Error( `Expected ${num} components for ${type}, got ${ret.length}:`, args );
        
    }
    
    return ret;
    
}

function matrixComponents( x, y, name, ...args ) {
    
    var e = [];
    
    if ( args.length <= 1 ) {
        
        var a = args.length === 1 ? args[ 0 ] : 1;
        
        for ( var iy = 0; iy < y; iy++ ) {
            
            for( var ix = 0; ix < x; ix++ ) {
                
                e.push( ix === iy ? a : 0 );
                
            }
            
        }
        
    } else {
        
        e = args;
        
    }
    
    return components( x * y, name, ...e );
    
}

function vectorCreator( length, typeName ) {
    
    return function ( ...args ) {
        
        if ( is( args[ 0 ], typeName ) ) return args[ 0 ];
        
        var comps = components( length, typeName, ...args );
        
        return defs.create[ typeName ]( ...comps );
        
    }
    
}

function matrixCreator ( x, y, typeName ) {
    
    return function( ...args ) {
        
        if ( is( args[ 0 ], typeName ) ) return args[ 0 ];
        
        var comps = matrixComponents( x, y, typeName, ...args );
        
        return defs.create[ typeName ]( ...comps );
        
    }
    
}

function createSampler2D ( a ) {
    
    return defs.create.sampler2D( a );
    
}

function createSamplerCube ( a ) {
    
    if( !Array.isArray(a) ) a = [a,a,a,a,a,a];
    
    return defs.create.samplerCube( a );
    
}