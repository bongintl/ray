var clamp = require('./clamp');

module.exports = function normalize( x, min, max ) {
    
    return clamp( (x - min) / (max - min), 0, 1);
    
}