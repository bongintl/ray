var { vec3 } = require('../core/types');
var DistanceModifier = require('./distancemodifier.js');

module.exports = class Offset extends DistanceModifier {
    
    name () {
        
        return 'offset';
        
    }
    
    params () {
        
        return {
            amount: 0
        }
        
    }
    
    write ( p, params, globals ) {
        
        return params.amount;
        
    }
    
}