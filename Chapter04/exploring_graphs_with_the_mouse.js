const WIDTH = 600;
const HEIGHT = 300;

const coordsPixels = (selector, itemOpt) => {
  const txt = d3.select( selector ).append( "text" );
  const svg = d3.select( selector ).attr( "cursor", "crosshair" )
    .on( "mousemove", function(event) {
      let pt  = d3.pointer( event );
      pt[0] = Math.floor(pt[0]);
      pt[1] = Math.floor(pt[1]);
      txt.attr( "x", 18 + pt[0] ).attr( "y", 6 + pt[1] )
        .text( "" + pt[0] + "," + pt[1] );
      if(itemOpt) {
        itemOpt.text( "" + pt[0] + "," + pt[1] );
      }
    });
}

function makeBrush(svg1, svg2, handler) {
    let scX = d3.scaleLinear()
      .domain( [0, HEIGHT] )
      .range( [0, WIDTH] );

    d3.csv( "dense.csv" ).then( function( data ) { 
        let sc1 = d3.scaleLinear().domain([0,10,50])
            .range(["lime","yellow","red"]);
        let sc2 = d3.scaleLinear().domain([0,10,50])
            .range(["lime","yellow","blue"]);
    
        let cs1 = drawCircles(svg1, data, d => scX(d["A"]), d => d["B"], sc1);
        let cs2 = drawCircles(svg2, data, d => scX(d["A"]), d => d["C"], sc2); 
    
        svg1.call( handler, data, cs1, cs2, sc1, sc2 );
    } );
}

function drawCircles( svg, data, accX, accY, sc ) {
    let color = sc(Infinity);

    return svg.selectAll( "circle" ).data( data ).enter()
        .append( "circle" )
        .attr( "r", 5 ).attr( "cx", accX ).attr( "cy", accY )
        .attr( "fill", color ).attr( "fill-opacity", 0.4 );     
}

function installHandlers( svg, data, cs1, cs2, sc1, sc2 ) {
    svg.attr( "cursor", "crosshair" )
        .on( "mousemove", function(event) {
            let pt  = d3.pointer( event );
            
            cs1.attr( "fill", function( d, i ) {
                let dx = pt[0] - d3.select( this ).attr( "cx" );
                let dy = pt[1] - d3.select( this ).attr( "cy" );
                let r = Math.hypot( dx, dy );
                
                data[i]["r"] = r;
                return sc1(r); } );
            
            cs2.attr( "fill", (d,i) => sc2( data[i]["r"] ) ); } )
    
        .on( "mouseleave", function() {
            cs1.attr( "fill", sc1(Infinity) );
            cs2.attr( "fill", sc2(Infinity) ); } );
} 
function installHandlers2( svg, data, cs1, cs2, sc1, sc2 ) {
    let cursor = svg.append( "circle" ).attr( "r", 50 )
        .attr( "fill", "none" ).attr( "stroke", "black" )
        .attr( "stroke-width", 10 ).attr( "stroke-opacity", 0.1 )
        .attr( "visibility", "hidden" );
    
    let hotzone = svg.append( "rect" ).attr( "cursor", "none" )
        .attr( "x", 25 ).attr( "y", 25 )
        .attr( "width", WIDTH - 25 * 2 ).attr( "height", HEIGHT - 25 * 2 )
        .attr( "pointer-events", "all" )
        .attr( "fill", "rgba(42, 0, 0, 0.2)" )
    
        .on( "mouseenter", function() {
            cursor.attr( "visibility", "visible" ); } )                
        
        .on( "mousemove", function() {
            let pt  = d3.pointer( event );
            cursor.attr( "cx", pt[0] ).attr( "cy", pt[1] );

            cs1.attr( "fill", function( d, i ) {
                let dx = pt[0] - d3.select( this ).attr( "cx" );
                let dy = pt[1] - d3.select( this ).attr( "cy" );
                let r = Math.hypot( dx, dy );

                data[i]["r"] = r;
                return sc1(r); } );
            
            cs2.attr( "fill", (d,i) => sc2( data[i]["r"] ) ); } )

        .on( "mouseleave", function() {                                 
            cursor.attr( "visibility", "hidden" );
            cs1.attr( "fill", sc1(Infinity) );
            cs2.attr( "fill", sc2(Infinity) ); } )
}

window.addEventListener("load", () => {
  d3.selectAll("svg")
    .attr( "width", WIDTH )
    .attr( "height", HEIGHT )
  const updateMouseCoord = d3.select("#exploring-graphs-with-the-mouse-ex1-body");
  coordsPixels( "#exploring-graphs-with-the-mouse-ex1", updateMouseCoord);
  let svg1 = d3.select( "#exploring-graphs-with-the-mouse-ex2-1" );
  let svg2 = d3.select( "#exploring-graphs-with-the-mouse-ex2-2" ); 
  let svg3 = d3.select( "#exploring-graphs-with-the-mouse-ex2-1-1" );
  let svg4 = d3.select( "#exploring-graphs-with-the-mouse-ex2-2-2" ); 
  makeBrush(svg1, svg2, installHandlers);
  makeBrush(svg3, svg4, installHandlers2);
});