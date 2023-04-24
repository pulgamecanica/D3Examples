function makeStagger() {
    let ds1 = [ 2, 1, 3, 5, 7, 8, 9, 9, 9, 8, 7, 5, 3, 1, 2 ];
    let ds2 = [ 8, 9, 8, 7, 5, 3, 2, 1, 2, 3, 5, 7, 8, 9, 8 ];
    let n = ds1.length, mx = d3.max( d3.merge( [ds1, ds2] ) );
    
    let svg = d3.select( "#smooth-transitions-1" );

    let scX = d3.scaleLinear().domain( [0,n] ).range( [50,600] );
    let scY = d3.scaleLinear().domain( [0,mx] ).range( [300,50] );

    let color = ["red", "gold"];

    svg.selectAll( "line" ).data( ds1 ).enter().append( "line" )
        .attr( "stroke", color[0] ).attr( "stroke-width", 20 )
        .attr( "x1", (d,i)=>scX(i) ).attr( "y1", scY(0) )
        .attr( "x2", (d,i)=>scX(i) ).attr( "y2", d=>scY(d) );

    svg.on( "click", function() {
        [ ds1, ds2 ] = [ ds2, ds1];
        color = [ color[1], color[0]];
        
        svg.selectAll( "line" ).data( ds1 )
            .transition().duration( 1000 ).delay( (d,i)=>200*i )
            .attr( "y2", d=>scY(d) )
            .attr( "stroke", color[0] );
    } );
}

function triangleSmoothAnimation() {
    let triangle = [[150, 50], [50, 50], [-100, 0]]
    let svg = d3.select( "#smooth-transitions-2" );

    let figure = svg.append('path')
      .attr('d', function(d) { 
        let [x, y] = triangle[0]
        return 'M ' + x +' '+ y + ' l ' + triangle[1][0] + ' ' + triangle[1][1] + ' l ' + triangle[2][0] + ' ' + triangle[2][1] + ' z';
      })
      .attr( "fill", "green");
    function animateFigure() {
        figure.transition().duration( 2000 ).ease( t=>t )
        .attrTween( "transform", function() {
            return t => "rotate(" + 360 * t + ", 150, 75)"
        })
        .transition().ease( t=>t )
        .attr( "fill", "red" )
        .on( "end", animateFigure );
    }
   animateFigure();
}

window.addEventListener( "load", () => {
    makeStagger();
    triangleSmoothAnimation();
} );