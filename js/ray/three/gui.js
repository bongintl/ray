var Uniform = require('../core/uniform');
var RayObject = require('../core/rayobject');

module.exports = function gui ( THREE, datGUI, scene ) {
    
    var addv3 = ( gui, object, property, min, max, name ) => {
            
        var f = gui.addFolder( name );
        
        var v = object[property];
        
        f.add( v, 'x', min, max );
        f.add( v, 'y', min, max );
        f.add( v, 'z', min, max );
        
    };
    
    var addColor = ( gui, object, property, name ) => {

        var dummy = {};
        
        dummy[ property ] = object[ property ].getStyle(); 
        
        gui = gui.addColor( dummy, property ).name( name || property );
        
        gui.onChange( value => object[ property ].setStyle( value ) );
        
        return gui;
        
    };
    
    var add = ( gui, object, property, name ) => {
        
        var value = object[ property ];
        
        if ( !isNaN( value ) ) {
            
            gui.add( object, property, -5, 5 ).name( name ).step(.01);
            
        } else if ( value instanceof THREE.Color ) {
            
            addColor( gui, object, property, name );
            
        } else if ( value instanceof THREE.Vector3 || value instanceof THREE.Euler ) {
            
            addv3( gui, object, property, -5, 5, name );
            
        }
        
    }
    
    var addObject = ( gui, object ) => {
        
        for ( var prop in object ) {
            
            let value = object[ prop ];
            
            if (
                value instanceof Uniform ||
                object.uniforms && prop in object.uniforms
            ) {
                
                add( gui, object, prop, prop );
                
            } else if ( value instanceof RayObject ) {
                
                var f = gui.addFolder( value.name() );
            
                addObject( f, value );
                
            }
            
        }
        
        if( object.children ) {
            
            object.children.forEach( (c, i) => {
                
                var f = gui.addFolder( i + ' ' + c.name() );
                
                addObject( f, c );
                
            });
            
        }
        
    }
    
    addObject( datGUI, scene );
    
}