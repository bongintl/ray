var Shader = require('../compiler/compiler.js');

module.exports = class THREEMaterial {
    
    constructor ( THREE, scene, options ) {
        
        var shader = new Shader( scene, options );
        
        var material = new THREE.ShaderMaterial({
            fragmentShader: shader.glsl,
            uniforms: shader.uniforms
        })
        
        material.shader = shader;
        
        material.update = shader.update.bind( shader );
        
        return material;
        
    }
    
}