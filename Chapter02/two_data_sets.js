const graphTwoDataSets = (data, svg_selector = "#two-data-sets") => {
  let pxX = 600, pxY = 300;
  let scX = d3.scaleLinear()
    .domain( d3.extent( data, d => d["x"] ) )
    .range( [0, pxX] );
  let scY1 = d3.scaleLinear()
    .domain( d3.extent( data, d => d["y1"] ) )
    .range( [pxY, 0] );
  let scY2 = d3.scaleLinear()
    .domain( d3.extent( data, d => d["y2"] ) )
    .range( [pxY, 0] );

  d3.select( svg_selector )
    .selectAll( "g" )
    .remove()

  d3.select( svg_selector )
    .append( "g" ).attr( "id", "ds1")
    .selectAll( "circle" )
    .data( data )
    .enter()
    .append( "circle" )
    .attr( "r", 4 ).attr( "fill", "#FFF3D9")
    .attr( "cx", function(d) { return scX(d["x"]) } )
    .attr( "cy", function(d) { return scY1(d["y1"]) } );

  d3.select( svg_selector )
    .append( "g" ).attr( "id", "ds2")
    .selectAll( "circle" )
    .data( data )
    .enter()
    .append( "circle" )
    .attr( "r", 4 ).attr( "fill", "#8134DF")
    .attr( "cx", function(d) { return scX(d["x"]) } )
    .attr( "cy", function(d) { return scY2(d["y2"]) } );

  let lineMaker = d3.line()
    .x( d => scX( d["x"] ) )
    .y( d => scY1( d["y1"] ) );

  d3.select( "#ds1" )
   .append( "path" )
   .attr( "fill", "none" ).attr( "stroke", "#FFF3D9")
   .attr( "d", lineMaker(data) );

  lineMaker.y( d => scY2( d["y2"] ) );

  d3.select( "#ds2" )
   .append( "path" )
   .attr( "fill", "none" ).attr( "stroke", "#8134DF")
   .attr( "d", lineMaker(data) );
};

const graphTwoDataSetsScales = (data, svg_selector = "#two-data-sets-scales") => {
  let svg =  d3.select(svg_selector)
  let pxX = svg.attr( "width" ), pxY = svg.attr( "height" );

  const makeScale = ( accessor, range ) => {
    return  d3.scaleLinear()
      .domain( d3.extent( data, accessor ) )
      .range( range ).nice();
  }

  let scX = makeScale( d => d["x"], [0, pxX] );
  let scY1 = makeScale( d => d["y1"], [pxY, 0] );
  let scY2 = makeScale( d => d["y2"], [pxY, 0] );

  d3.select( svg_selector )
    .selectAll( "g" )
    .remove()

  const drawData = (g, accessor, curve, color) => {
    g.selectAll( "circle" ).data( data ).enter()
      .append( "circle" )
      .attr( "r", 4 ).attr( "fill", color)
      .attr( "cx", (d) => scX( d["x"] ) )
      .attr( "cy", accessor );
    
    let lineMaker = d3.line().curve( curve )
      .x( d => scX( d["x"] ) ).y( accessor );

    g.append( "path" )
     .attr( "fill", "none" ).attr( "stroke", color)
     .attr( "d", lineMaker(data) );
  }

  let g1 = svg.append( "g" );
  let g2 = svg.append( "g" );
  
  drawData( g1, d => scY1( d["y1"] ), d3.curveStep, "#FFF3D9");
  drawData( g2, d => scY2( d["y2"] ), d3.curveNatural, "#8134DF");

  let axisMaker = d3.axisRight( scY1 );
  axisMaker( svg.append( "g" ).attr("class", "axisWhite") );
  axisMaker = d3.axisLeft( scY2 );
  svg.append( "g" )
    .attr( "class", "axisWhite" )
    .attr( "transform", "translate(" + pxX + ",0)" )
    .call( axisMaker );

  svg.append( "g" ).call( d3.axisTop( scX ) )
    .attr( "class", "axisWhite" )
    .attr( "transform", "translate(0," + pxY + ")" );
};

const updateTwoDataSets = (file) => {
  let file_reader = new FileReader();
  file_reader.onload = function() {
    d3.select('#two-data-sets-title').text(file.name);
    d3.select('#two-data-sets-file-body').text(file_reader.result);
    try {
      graphTwoDataSets(d3.tsvParse(file_reader.result));
      graphTwoDataSetsScales(d3.tsvParse(file_reader.result));
    } catch (error) {
      console.error(error);
    }
  }
  file_reader.readAsText(file);
}

window.addEventListener("load", () => {
  d3.selectAll("svg")
    .attr( "width", 600 )
    .attr( "height", 300 )

  d3.tsv( "data/example-multiple-data-set.tsv" )
    .then( function( data ) {
      graphTwoDataSets(data);
      graphTwoDataSetsScales(data);
    });
  d3.select( '#two-data-sets-file' )
    .on('change', function() {
      updateTwoDataSets(this.files[0]);
    });
});
