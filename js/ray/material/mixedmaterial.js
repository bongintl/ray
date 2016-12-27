module.exports = class MixedMaterial extends Material {
    
    params () {
        
        return {
            map: samplerCube(),
            threshold: 0
        };
        
    }
    
    write ( m1, m2, params ) {
        
        return `mix( ${ m1 }, ${ m2 },  )`;
        
    }
    
}