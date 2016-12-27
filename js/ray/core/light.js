var { vec3 } = require('./types');
var RayObject = require('./rayobject.js');

module.exports = class Light extends RayObject {
    
    constructor( params ) {
        
        super( params );
        
        //this.position.normalize();
        
    }
    
    params () {
        
        return {
            position: vec3(),
            color: vec3(1),
            brightness: 1,
            min: 0,
            max: 1
        }
        
    }
    
}