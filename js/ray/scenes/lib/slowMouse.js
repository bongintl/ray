var rAF = require('./rAF');

var real = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

window.addEventListener( 'mousemove', e => {
    
    real.x = e.clientX;
    real.y = e.clientY;
    
});

module.exports = function( speed, cb ) {
    
    if ( !cb ) {
        cb = speed;
        speed = .1;
    }
    
    var curr = { x: real.x, y: real.y };
    
    rAF.start( 'slowMouse', () => {
        
        curr.x += ( real.x - curr.x ) * speed;
        curr.y += ( real.y - curr.y ) * speed;
        
        cb( curr.x, curr.y );
        
    })
    
}