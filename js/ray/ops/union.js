var Op = require('./op.js');

module.exports = class Union extends Op {
    
    name () {
        
        return 'union';
        
    }
    
    write ( left, right ) {
        
        return `min( ${left}, ${right} )`;
        
    }
    
}