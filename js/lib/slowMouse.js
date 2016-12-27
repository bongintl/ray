var clamp = require('./clamp');
var rAF = require('./rAF');

module.exports = function( options ) {
    
    options = Object.assign( {
        speed: .1,
        onChange: () => {},
        limit: { top: 0, left: 0, right: 0, bottom: 0 }
    }, options );
    
    var real = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var curr = { x: real.x, y: real.y };

    window.addEventListener( 'mousemove', e => {
        
        var left = options.limit.left * window.innerWidth;
        var right = window.innerWidth - (options.limit.right * window.innerWidth);
        
        var top = options.limit.top * window.innerHeight;
        var bottom = window.innerHeight - (options.limit.bottom * window.innerHeight);
        
        real.x = clamp( e.clientX, left, right );
        real.y = clamp( e.clientY, top, bottom );
        
    });
    
    rAF.start( 'slowMouse', () => {
        
        curr.x += ( real.x - curr.x ) * options.speed;
        curr.y += ( real.y - curr.y ) * options.speed;
        
        options.onChange( curr.x, curr.y );
        
    })
    
}