var Op = require('./op.js');

module.exports = class Subtract extends Op {
    
    name () {
        
        return 'subtract';
        
    }
    
    write ( left, right ) {
        
        return `max( ${ left }, -${ right })`;
        
    }

};