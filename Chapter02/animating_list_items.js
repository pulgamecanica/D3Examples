let items = ["Park", "beach", "School", "Mall", "metro", "Museum"]
let selectedItems = [];

const drawList = () => {
  items.sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  d3.select( "#list-container" ).select( "ul" )
    .remove();
  d3.select( "#list-container" )
    .append( "ul" ).selectAll( "li" )
    .data(items).enter()
    .append( "li" ).text( d => d )
    .on( "click", function () {
      this.toggleState = !this.toggleState;
      addRemoveSelectedItem(this.textContent)
      d3.select( this )
        .transition().duration(2000)
        .style( "color", this.toggleState ? "red" : "black" );
    });
}

const drawSelectedItems = () => {
  selectedItems.sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  d3.select( "#animating-list-title").text(selectedItems.length + " Selected Items");
  d3.select( "#animating-list-body" ).selectAll( "p" ).remove();
  if (selectedItems.length) {
    d3.select( "#animating-list-body" ).selectAll( "p" )
      .data( selectedItems ).enter()
      .append( "p" ).text( d => d );
  } else {
    d3.select( "#animating-list-body" ).append( "p" ).text("No Items Selected");
  }
}

const addNewItem = (item) => {
  if (item.trim()) items.push(item);
  drawList();
};

const addRemoveSelectedItem = (item) => {
  if (!item.trim()) return;
  let founded = selectedItems.indexOf(item);
  if (founded >= 0) {
    selectedItems.splice(founded, 1);
  } else {
    selectedItems.push(item);
  }
  drawSelectedItems();
}

window.addEventListener("load", () => {
  d3.select( "#list-submit-input" )
    .on( 'click', function() {
      event.preventDefault()
      addNewItem( d3.select( "#list-text-input" ).node().value );
      d3.select( "#list-text-input" ).node().value = null;
    });
  drawList();
  drawSelectedItems();
});