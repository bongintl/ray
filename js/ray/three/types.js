module.exports = function ( THREE ) {
    
    var tl = new THREE.TextureLoader();
    var ctl = new THREE.CubeTextureLoader();
    
    var m4 = new THREE.Matrix4();
    
    return {
        
        create: {
            
            vec2: ( x, y ) =>  new THREE.Vector2( x, y ),
            
            vec3: ( x, y, z ) => new THREE.Vector3( x, y, z ),
            
            vec4: ( x, y, z, w ) => new THREE.Vector4( x, y, z, w ),
            
            mat4: ( ...elements ) => new THREE.Matrix4().set( ...elements ),
            
            sampler2D: ( a ) => {
                
                if ( typeof a === 'string' ) return tl.load( a );
                
                if ( a instanceof Image ) return new THREE.Texture( a );
                
            },
            
            samplerCube: ( a ) => {
                
                if ( typeof a[0] === 'string' ) return ctl.load( a );
                    
                if ( a[0] instanceof Image ) return new THREE.CubeTexture( a );
                
            }
            
        },
        
        test: {
            
            vec2: x => x instanceof THREE.Vector2,
            
            vec3: x => {
                
                return (
                    x instanceof THREE.Vector3 ||
                    x instanceof THREE.Euler ||
                    x instanceof THREE.Color
                )
            
            },
            
            vec4: x => {
                
                return (
                    x instanceof THREE.Vector4 ||
                    x instanceof THREE.Quaternion
                )
                
            },
            
            mat4: x => x instanceof THREE.Matrix4,
            
            sampler2D: x => x instanceof THREE.Texture,
            
            samplerCube: x => x instanceof THREE.CubeTexture
            
        },
        
        toArray: x => x.toArray(),
        
        getTransform: () => {
            
            return {
                position: new THREE.Vector3(),
                rotation: new THREE.Euler(),
                quaternion: new THREE.Quaternion(),
                scale: new THREE.Vector3(1, 1, 1),
                matrixInverse: new THREE.Matrix4()
            }
            
        },
        
        initObject: obj => {
            
            var r = obj.rotation;
            var q = obj.quaternion;
            
            if( r instanceof THREE.Vector3 ) {
                r = obj.rotation = new THREE.Euler( r.x, r.y, r.z );
            }
            
            if( q instanceof THREE.Vector4 ) {
                q = obj.quaternion = new THREE.Quaternion( q.x, q.y, q.z, q.w );
            }
            
            if( r.x !== 0 || r.y !== 0 || r.z !== 0 ) {
                q.setFromEuler( r, false );
            }
            
            r.onChange( () => {
                q.setFromEuler( r, false );
            });
            
            q.onChange( () => {
                r.setFromQuaternion( q, undefined, false );
            });
            
        },
        
        composeInverseMatrix: object => {
            
            m4.compose( object.position, object.quaternion, object.scale );
            
            object.matrixInverse.getInverse( m4 );
            
        }
        
    }
    
}