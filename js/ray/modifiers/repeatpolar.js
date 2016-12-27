var Modifier = require('./modifier.js');

module.exports = class RepeatPolar extends Modifier {
    
    constructor ( target, options ) {
        
        super( target );
        
        this.angle = (options && options.angle) || 'PI / 4.';
        this.axis = (options && options.axis) || 'y';
        
    }
    
    declare () {
        
        var a1, a2, ret;
        
        switch( this.axis ) {
            
            case 'x':
                a1 = 'y';
                a2 = 'z';
                ret = 'vec3(p.x, cos(a) * r, sin(a) * r)';
                break;
                
            case 'y':
                a1 = 'x';
                a2 = 'z';
                ret = 'vec3( cos(a) * r, p.y, sin(a) * r )';
                break;
                
            case 'z':
                a1 = 'x';
                a2 = 'y';
                ret = 'vec3( cos(a) * r, sin(a) * r, p.z )';
                break;
                
        }
        
        return `
            vec3 repeatPolar${ this.axis.toUpperCase() }( vec3 p, float angle ) {
                
                float a = atan(p.${a2}, p.${a1}) + angle/2.;
                float r = length(p.${a1+a2});
                float c = floor(a/angle);
                a = mod(a,angle) - angle/2.;
                return ${ret};
                
            }
        `
        
    }
    
    getUniforms () {
        
        return {
            angle: 'float'
        }
        
    }
    
    write ( p ) {
        
        return this.target.write( `repeatPolar${ this.axis.toUpperCase() }( ${p}, ${this.uniforms.angle} )` );
        
    }
    
}