function makeLines() {
  let data = [[1, 1], [2, 2], [3, 4], [4, 4], [5, 2], [6, 2], [7, 3], [8, 1], [9, 2]];

  let scX = d3.scaleLinear().domain( d3.extent( data, d => d[0] ) ).range([50, WIDTH - 50]);
  let scY = d3.scaleLinear().domain( d3.extent( data, d => d[1] ) ).range([HEIGHT - 25, 25]);

  data = data.map( (d) => [scX(d[0]), scY(d[1])]);

  let svg = d3.select("#curves_and_lines");

  svg.append( "g" ).selectAll( "circle" )
  	.data( data ).enter().append( "circle" ).attr( "r", "3" )
  	.attr( "cx", d => d[0] ).attr( "cy", d => d[1] ).attr( "fill", "purple" )

  let lineMkr = d3.line().defined( (d,i) => i == 3 ? false : true);

  svg.append( "g" ).append( "path" )
  	.attr( "d", lineMkr(data) )
  	.attr( "fill", "none" ).attr( "stroke", "red" );
}

window.addEventListener("load", () => {
  makeLines();
});

