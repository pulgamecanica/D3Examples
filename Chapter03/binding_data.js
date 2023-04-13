const svgHeight = 300, svgWidth = 600;
const states = [[["Mary", 1], ["Leonardo", 4], ["Peter", 2]], [["Peter", 5], ["Leonardo", 3]]]

function makeKeys() {
  let scX = d3.scaleLinear().domain([0, 6]).range([50, svgWidth]),
    scY = d3.scaleLinear().domain([0, 3]).range([50, svgHeight]);
  
  let j = -1, k = -1;

  let svg = d3.select( "#binding-data-ex1" );

  svg.selectAll( "text" )
    .data( states[0] ).enter().append( "text" )
    .attr( "x", 20 ).attr( "y", d => scY(++j) ).text( d => d[0] );

  svg.selectAll( "circle" )
    .data( states[0] ).enter().append( "circle" )
    .attr( "r", 5).attr( "fill", "red" )
    .attr( "cx", d => scX(d[1]) ).attr( "cy", d => scY(++k) - 5 );

  svg.on( "click", function() {
    let cs = svg.selectAll( "circle" ).data( states[1], d => d[0] )

    cs.transition().duration(1000).attr( "cx", d => scX(d[1]) );
    cs.exit().attr( "fill", "blue" );
  });
}

const states2 = [ [ [2, 3, "green"], [1, 2, "red"], [2, 1, "blue"], [3, 2, "yellow"] ], [ [1, 1, "red"], [3, 3, "black"], [1, 3, "lime"], [3, 1, "blue"] ] ];

function makeUpdate() {
  let scX = d3.scaleLinear().domain([1, 3]).range([100, svgWidth - 100]),
      scY = d3.scaleLinear().domain([1, 3]).range([50, svgHeight - 50]);
  
  let svg = d3.select( "#binding-data-ex2" );

  states2.reverse();
  svg.on( "click", function() {
      [ states2[0], states2[1] ] = [ states2[1], states2[0] ]
      var cs = svg.selectAll( "circle" ).data( states2[0], d => d[2] );
      
      cs.exit().remove();
      cs = cs.enter().append( "circle" )
          .attr( "r", 5 ).attr( "fill", d => d[2] )
          .merge( cs );
      cs.attr( "cx", d => scX(d[0]) ).attr( "cy", d => scY(d[1]) );
  } );
  svg.dispatch( "click" );
}

window.addEventListener("load", () => {
  let dataTable = d3.select( "#binding-data-ex1-body" ).append( "table" );
  let dataTableRows = dataTable.selectAll( "tr" ).data( states ).enter().append( "tr" )

  dataTableRows.selectAll( "td" ).data(d => d).enter().append( "td" ).text( d => d[0] ).append( "td" ).text( d => d[1] );

  let dataTable2 = d3.select( "#binding-data-ex2-body" ).append( "table" );
  let dataTableRows2 = dataTable2.selectAll( "tr" ).data( states2 ).enter().append( "tr" )

  dataTableRows2.selectAll( "td" ).data(d => d).enter().append( "td" ).text( d => d[2] ).append( "td" ).text( d => "[" + d[0] + "," + d[1] + "]" );

  d3.selectAll( "#binding-data-ex1,#binding-data-ex2" )
    .attr( "width", svgWidth )
    .attr( "height", svgHeight );
  makeKeys()
  makeUpdate()
});
