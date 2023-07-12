MAP_WIDTH = 300;
MAP_HEIGHT = 270;

window.addEventListener("load", () => {
  let map = "252226200111111211112111111131111101110111111111";
  let width = 8;
  let height = map.length / width;
  let tile_size = {x: MAP_WIDTH / width, y: MAP_HEIGHT / height};
  let svg = d3.select("#map");
  let data = map.split("");
  let scX = d3.scaleLinear().domain([0, width]).range([0, MAP_WIDTH]);
  let scY = d3.scaleLinear().domain([0, height - 1]).range([0, MAP_HEIGHT - tile_size.y]);
  let scColor = d3.scaleOrdinal( d3.schemePastel2 ).domain( d3.extent( data ) )

  svg.attr("height", MAP_HEIGHT);
  svg.attr("width", MAP_WIDTH);
  
  svg.selectAll( "rect" )
    .data( data )
    .enter()
    .append( "rect" )
    .attr( "stroke", "gray" ).attr( "fill", d => scColor(d) )
    .attr( "x", (d, i) => { return scX(i % width) } )
    .attr( "y", (d, i) => { return scY(Math.floor(i / width)) } )
    .attr( "width", tile_size.x )
    .attr( "height", tile_size.y );
});

