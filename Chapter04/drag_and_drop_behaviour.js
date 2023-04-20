const drawCircles2 = (svg, circles) => {
  svg.selectAll( "circle" )
    .data( circles ).enter().append( "circle" )
    .attr( "r", d => d["r"] )
    .attr( "cx", d => d["cx"] )
    .attr( "cy", d => d["cy"] )
    .attr( "fill", d => d["color"] );
}

window.addEventListener("load", () => {
  d3.selectAll("svg")
      .attr( "width", 600 )
      .attr( "height", 300 )

  let svg = d3.select("#drag-drop-behaviour");
  let circles = [
    {r: 20, color: "red", cx: 50, cy: 100},
    {r: 20, color: "green", cx: 250, cy: 150},
    {r: 20, color: "blue", cx: 350, cy: 100}
  ];
  drawCircles2( svg, circles );

  let color = undefined, widget = undefined;
  
  svg.selectAll( "circle" )
    .call( d3.drag()
        .on( "start", function () {
          color = d3.select( this ).attr( "fill" );
          widget = d3.select( this ).attr( "fill", "lime" );
        } )
        .on( "drag", function () {
          let pt = d3.pointer( event, this );
          widget.attr( "cx", pt[0] ).attr( "cy", pt[1] )
        } )
        .on( "end", function () {
          widget.attr( "fill", color );
          widget = undefined;
          color = undefined;
        } )
    );
} );