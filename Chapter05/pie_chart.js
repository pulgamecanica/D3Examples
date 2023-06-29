window.addEventListener("load", () => {
  let svg = d3.select("#pie_chart");
  svg.attr("height", 350);
  let data = [
    {name: "Bob", votes: 4},
    {name: "Amelie", votes: 15},
    {name: "Emily", votes: 20},
    {name: "Ferdinand", votes: 18},
    {name: "Frank", votes: 25},
    {name: "Mariane", votes: 12},
  ];

  let pie = d3.pie().value( d=>d.votes ).padAngle( 0.02 )( data );

  let arcMkr = d3.arc().innerRadius(50).outerRadius(150).cornerRadius(5)

  let scX = d3.scaleOrdinal( d3.schemePastel2 ).domain( pie.map(d=>d.index) )

  let g = svg.append( "g" ).attr( "transform", "translate(300, 170)");

  g.selectAll("path").data( pie ).enter().append( "path" )
    .attr( "d", arcMkr ).attr( "fill", d=>scX(d.index) ).attr( "stroke", "gray" );

  g.selectAll("text").data( pie ).enter().append( "text" )
    .text( d=>d.data.name )
    .attr( "x", d=>arcMkr.innerRadius(85).centroid(d)[0] )
    .attr( "y", d=>arcMkr.innerRadius(85).centroid(d)[1] )
    .attr( "font-family", "sans-serif" ).attr("font-size", 15)
    .attr( "text-anchor", "middle" )
});

