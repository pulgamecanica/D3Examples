function generateSingleCard(data) {
  console.log(data);
}

const generateCards = (data) => {
  let cards =  d3.select("#index-cards-container")
    .selectAll( "div" )
    .data( data )
    .enter()
    .append( "div" )
    .attr( "class", function(d) { return "card " + (d.reverse ? "card-rev " : "") + (d.type === "main" ? "main-card" : "chapter-card") } )

  let cardAside = cards.append( "aside" )
    .attr( "class", "card-content" )    
  
  cardAside.append( "p" )
    .attr( "class", "vertical-label" )
    .text( d => d.label )

  let cardTitle = cardAside.append( "p" )
    .attr( "class", "card-title" )
  
  cardTitle.append( "span" ).attr( "class", "lead" )
  .text( d => d.titleLead )
  
  cardTitle.append( "span" ).attr( "class", "last" )
    .selectAll( "span" )
    .data( d => d.title )
    .enter()
    .append( "span" )
    .text( d => d )

  cardAside.append( "hr" )
    .attr( "class", "card-ruler" )
  
  cardAside.append( "p" )
    .attr( "class", "card-description" )
    .text( d => d.description )

  cards.append( "span" )
    .attr( "class", "card-image" )
    .style( "background-image",  d => "url(" + d.imageUrl + ")" )
    .append( "p" )
    .text( d => d.imageTitle )


  console.log(data);
}

window.addEventListener("load", () => {
  d3.json( "index.json" )
    .then( function( data ) {
      generateCards(data);
    });
});