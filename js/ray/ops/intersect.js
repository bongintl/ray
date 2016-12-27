var Op = require('./op.js');

module.exports = class Intersect extends Op {
    
    name () {
        
        return 'intersect';
        
    }
    
    write ( left, right ) {
        
        return `max(${ left }, ${ right })`;
        
    }

    
}