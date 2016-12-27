var gdf = require('./primitives/gdf');

module.exports = {
    
    config: require('./config'),
    
    types: require('./core/types'),
    
    Uniform: require('./core/uniform'),
    
    RayObject: require('./core/rayobject'),
    TransformableObject: require('./core/transformableobject'),
    
    // Primitives
    Primitive: require('./primitives/primitive'),
    Sphere: require('./primitives/sphere'),
    Torus: require('./primitives/torus'),
    Cone: require('./primitives/cone'),
    Box: require('./primitives/box'),
    RoundBox: require('./primitives/roundbox'),
    Cylinder: require('./primitives/cylinder'),
    Fruit: require('./primitives/fruit'),
    Octahedron: gdf.Octahedron,
    Dodecahedron: gdf.Dodecahedron,
    Icosahedron: gdf.Icosahedron,
    TruncatedOctahedron: gdf.TruncatedOctahedron,
    TruncatedIcosahedron: gdf.TruncatedIcosahedron,
    
    // Ops
    Op: require('./ops/op'),
    Union: require('./ops/union'),
    Subtract: require('./ops/subtract'),
    Intersect: require('./ops/intersect'),
    Blend: require('./ops/blend'),
    Smooth: require('./ops/smooth'),
    
    // Modifiers
    PositionModifier: require('./modifiers/positionmodifier'),
    DistanceModifier: require('./modifiers/distancemodifier'),
    Noise: require('./modifiers/noise'),
    Offset: require('./modifiers/offset'),
    Twist: require('./modifiers/twist'),
    Rotator: require('./modifiers/rotator'),
    Reflect: require('./modifiers/reflect'),
    //Repeat: require('./modifiers/repeat'),
    //RepeatPolar: require('./modifiers/repeatpolar'),
    //Wave: require('./modifiers/wave'),
    //Voxel: require('./modifiers/voxel'),
    
    Material: require('./core/material'),
    Light: require('./core/light'),
    
    THREEMaterial: require('./three/threematerial'),
    THREERenderer: require('./three/threerenderer')
    
}