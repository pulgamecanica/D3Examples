WIDTH=600
HEIGHT=300


function makeCrossHairs() {
  let data = [[180, 1], [260, 3], [340, 2], [420, 4]];

  d3.select("#symbols")
    .selectAll( "use" ).data( data ).enter().append( "use" )
    .attr( "href", "#crosshair" )
    .attr( "transform", d => {
      return "translate(" + d[0] + "," + HEIGHT / 2 + ") scale(" + 2*d[1] + ")"
    })
    .attr( "stroke", "black" )
    .attr( "stroke-width", d=>0.5/Math.sqrt(d[1]) );
}

window.addEventListener("load", () => {
  d3.selectAll("svg")
      .attr( "width", WIDTH )
      .attr( "height", HEIGHT )

  makeCrossHairs();
});

