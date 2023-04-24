const getInputFrequency = (inputId, slot) => {
    if (!inputId || !slot)
        return
    let newFreq = (d3.select( "#" + inputId ).node().value * 0.1).toFixed(2);
    slot.text(newFreq);
    return newFreq;
}

function makeLissajous(slot1, slot2) {
    var svg = d3.select( "#lissajous" );

    var a = 5.2, b = 5.9;                 // Lissajous frequencies
    var phi, omega = 2*Math.PI/10000;     // 10 seconds per period

    var crrX = 300+100, crrY = 150+0;
    var prvX = crrX, prvY = crrY;

    var timer = d3.timer( function(t) {
        a = getInputFrequency("frequency1", slot1) || a;
        b = getInputFrequency("frequency2", slot2) || b;
        phi = omega*t;

        crrX = 300+100*Math.cos(a*phi);
        crrY = 150+100*Math.sin(b*phi);

        svg.selectAll( "line" )
            .each( function() { this.bogus_opacity *= .99 } )
            .attr( "stroke-opacity",
                   function() { return this.bogus_opacity } )
            .filter( function() { return this.bogus_opacity<0.05 } )
            .remove(); 
        
        svg.append( "line" )
            .each( function() { this.bogus_opacity = 1.0 } )
            .attr( "x1", prvX ).attr( "y1", prvY ) 
            .attr( "x2", crrX ).attr( "y2", crrY )
            .attr( "stroke", "green" ).attr( "stroke-width", 2 );

        prvX = crrX;
        prvY = crrY;

    } );
}

window.addEventListener( "load", () => {
    const freqBody = d3.select( "#frequency-body" );
    const freq1Slot = freqBody.append( "p" ).text( "Frequency 1: ").append( "span" );
    const freq2Slot = freqBody.append( "p" ).text( "Frequency 2: ").append( "span" );
    makeLissajous(freq1Slot, freq2Slot);
} );

window.addEventListener( "load", makeVoters );
function makeVoters() {
    var n = 50, w=300/n, dt = 3000, svg = d3.select( "#voters" );

    svg.attr( "width", 300 ).attr( "height", 300 )
    
    var data = d3.range(n*n)
        .map( d => { return { x: d%n, y: d/n|0,
                              val: Math.random() } } ); 

    var sc = d3.scaleQuantize()
        .range( [ "white", "red", "black" ] );  

    svg.selectAll( "rect" ).data( data ).enter().append( "rect" )
        .attr( "x", d=>w*d.x ).attr( "y", d=>w*d.y )
        .attr( "width", w-1 ).attr( "height", w-1 )
        .attr( "fill", d => sc(d.val) );

    function update() {
        var nbs = [ [0,1], [0,-1], [ 1,0], [-1, 0],
                    [1,1], [1,-1], [-1,1], [-1,-1] ];
        return d3.shuffle( d3.range( n*n ) ).map( i => {
            var nb = nbs[ nbs.length*Math.random() | 0 ];
            var x = (data[i].x + nb[0] + n)%n;
            var y = (data[i].y + nb[1] + n)%n;
            data[i].val = data[ y*n + x ].val;
        } );
    }

    d3.interval( function() {
        update();
        svg.selectAll( "rect" ).data( data )
            .transition().duration(dt).delay((d,i)=>i*0.25*dt/(n*n))
            .attr( "fill", d => sc(d.val) ) }, dt );
}