var Op = require('./op.js');

module.exports = class Blend extends Op {
    
    name() {
        
        return 'blend';
        
    }
    
    params () {
        
        return { amount: 0 };
        
    }
    
    write ( left, right, params ) {
        
        return `mix(${ left }, ${ right }, ${ params.amount })`;
        
    }

    
};