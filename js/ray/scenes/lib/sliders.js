var container = document.createElement('div');

container.classList.add('sliders');

document.body.appendChild(container);

module.exports = function( question, left, right, onChangeLeft, onChangeRight ) {
    
    var element = document.createElement('div');
    var leftLabel = document.createElement('span');
    var rightLabel = document.createElement('span');
    
    var slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", -1);
    slider.setAttribute("max", 1);
    slider.setAttribute("step", .0001);
    
    var handler;
    
    if( onChangeRight ) {
        
        handler = event => {
            
            var v = Number( event.target.value );
            
            if ( v < 0 ) {
                
                onChangeLeft( -v );
                onChangeRight( 0 );
                
            } else {
                
                onChangeLeft( 0 );
                onChangeRight( v );
                
            }
            
        }
        
    } else {
        
        handler = event => onChangeLeft( Number(event.target.value) )
        
    }
    
    slider.addEventListener('input', handler );
    
    leftLabel.innerText = left;
    rightLabel.innerText = right;
    
    element.appendChild( leftLabel );
    element.appendChild( slider );
    element.appendChild( rightLabel );
    
    var q = document.createElement('p');
    q.innerText = question;
    
    container.appendChild(q);
    container.appendChild(element);
    
}