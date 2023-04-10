/**
 * Will generate a graph for a given data set.
 * data is an array of objects: 
​ * columns: Array [ "x", "y" ]
 * 0: Object { x: "100", y: "50" }
 * ...
 * svg_selector is the svg where the data will
 * be displayed with circles.
 **/
const graphSimpleDataSet = (data, svg_selector = "#a-single-data-set") => {
  d3.select( svg_selector )
    .selectAll( "circle" )
    .remove()
  d3.select( svg_selector )
    .selectAll( "circle" )
    .data( data )
    .enter()
    .append( "circle" )
    .attr( "r", 10 ).attr( "fill", "lightblue")
    .attr( "cx", function(d) { return d["x"] } )
    .attr( "cy", function(d) { return d["y"] } );
};

const updateSimpleDataSet = (file) => {
  console.log(file);
  var file_reader = new FileReader();
  file_reader.onload = function() {
    d3.select('#simple-data-set-title').text(file.name);
    d3.select('#simple-data-set-file-body').text(file_reader.result);
    try {
      graphSimpleDataSet(d3.tsvParse(file_reader.result));
    } catch (error) {
      console.error(error);
    }
  }
  file_reader.readAsText(file);
}

window.addEventListener("load", () => {
  d3.tsv( "data/example-set.tsv" )
    .then( function( data ) {
      graphSimpleDataSet(data);
    });
  d3.select( '#simple-data-set-file' )
    .on('change', function() {
      updateSimpleDataSet(this.files[0]);
    });
});