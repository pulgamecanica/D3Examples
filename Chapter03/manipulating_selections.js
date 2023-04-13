let data = [ "Jane", "Anne", "Mary" ];

const addData = (newElement) => {
  if (newElement && newElement.trim()) data.push(newElement);
}

function makeSort() {
    let ul = d3.select( "#manipulating-selection" );

    ul.selectAll( "li" ).data( data ).enter().append( "li" )
        .text( d=>d ); 

    let once;
    ul.on( "mouseenter", function() {
        if( once ) { return; }  
        once = 1;
        ul.insert( "li", ":nth-child(2)" )
            .datum( "Lucy" ).text( "Lucy" ); 
        data.push("Lucy") 
        ul.insert( "li", ":first-child" )
            .datum( "Lisa" ).text( "Lisa" );
        data.push("Lisa") 
    } );

    ul.on( "click", function() {
        ul.selectAll( "li" ).sort( (a,b)=>( a<b?1:b<a?-1:0 ) );
    } );
}

window.addEventListener("load", () => {
  d3.select( "#manipulating-selection-submit-input" )
    .on( 'click', function() {
      event.preventDefault()
      addData(d3.select( "#manipulating-selection-input" ).node().value);
      d3.select( "#manipulating-selection-input" ).node().value = null;
      makeSort()  
    });
  makeSort();
});