var $ = require('jquery');
var clamp = require('./lib/clamp');
var normalize = require('./lib/normalize');
var scale = require('./lib/scale');
var slowMouse = require('./lib/slowMouse');

var $question = $('.question');
var $pct1 = $('sup').eq(0);
var $pct2 = $('sup').eq(1);

// slowMouse({
//     limit: {
//         top: 1/3,
//         bottom: 1/3,
//         left: 0,
//         right: 0
//     },
//     onChange: (x, y) => {
       
//       var h = window.innerHeight;
        
//         y = scale( y, h * 1/3, h * 2/3, -1, 1 );
        
//         console.log(y);
        
//         $question.css('transform', `translate3d(0, ${ y * -12.5 }%, 0)`);
        
//         $pct1.text( Math.round( clamp( -y ) * 100 ) + '%' )
//         $pct2.text( Math.round( clamp( y ) * 100 ) + '%' );
      
//     }
// });