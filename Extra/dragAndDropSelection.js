const W = 400;
const H = 300;

function SelectionWindow(svg, rows = 6, columns = 4) {
	this.svg = svg;
	this.tilesPerRow = rows;
	this.tilesPerColumn = columns;
	this.tileSize = { width: W / columns, height: H / rows };
	this.tiles = [];
	this.rectSelection = {x: 0, y: 0, width: 0, height: 0};
}

SelectionWindow.prototype = {
	init : function() {
		let seed = "ABCDEFGHIJKMNLOPQRSTWXYZ";
		for (var i = 0; i < this.tilesPerRow * this.tilesPerColumn; i++) {
				this.tiles.push({coords: this.indexToCoords(i), key: seed[Math.floor(Math.random() * seed.length)], selected: false});
		}
		this.scColor = d3.scaleOrdinal( d3.schemePastel2 ).domain( d3.extent(this.tiles) );
		this.svg.call( d3.drag()
			.on( "start", () => { 
				let pt = d3.pointer( event, event.target );
				this.rectSelection.x = pt[0];
				this.rectSelection.y = pt[1];
			})
			.on ( "drag", () => {
				let pt = d3.pointer( event, event.target );
				this.rectSelection.width = pt[0] - this.rectSelection.x;
				this.rectSelection.height = pt[1] - this.rectSelection.y;
				this.update();
			})
			.on ( "end", () => {
				if (this.rectSelection.width < 0) {
					this.rectSelection.x = this.rectSelection.x + this.rectSelection.width;
					this.rectSelection.width = -this.rectSelection.width;
				}
				if (this.rectSelection.height < 0) {
					this.rectSelection.y = this.rectSelection.y + this.rectSelection.height;
					this.rectSelection.height = -this.rectSelection.height;
				}
				this.updateSelectedTiles();
				this.rectSelection = {x: 0, y: 0, width: 0, height: 0};
				this.update();
			})
		);
	},

	updateSelectedTiles : function() {
		let rectTopLeftCorner = {
			x: Math.floor(this.rectSelection.x / this.tileSize.width),
			y: Math.floor(this.rectSelection.y / this.tileSize.height)
		};
		let rectBottomDownCorner = {
			x: Math.floor((this.rectSelection.x + this.rectSelection.width) / this.tileSize.width),
			y: Math.floor((this.rectSelection.y + this.rectSelection.height) / this.tileSize.height)
		};
		for (let i = 0; i < this.tiles.length; i++) {
		 	let tileCords = this.indexToCoords(i);
		 	// Check if the rectangle passes throguth this coordinate
			if (tileCords.x >= rectTopLeftCorner.x && tileCords.x <= rectBottomDownCorner.x &&
					tileCords.y >= rectTopLeftCorner.y && tileCords.y <= rectBottomDownCorner.y)
				this.tiles[i].selected = !this.tiles[i].selected;
		}
	},

	indexToCoords : function(index) {
		return ({x: Math.floor(index % this.tilesPerColumn), y: Math.floor(index / this.tilesPerColumn)});
	},

	update : function() {
		this.svg.selectAll("g").remove();
		let tileSection = this.svg.selectAll("g").data( this.tiles ).enter().append( "g" )
		tileSection.append( "rect" )
			.attr( "x", (d) => { return d.coords.x * this.tileSize.width } )
			.attr( "y", (d) => { return d.coords.y * this.tileSize.height } )
			.attr( "width", (d) => this.tileSize.width )
			.attr( "height", (d) => this.tileSize.height )
			.attr( "fill", (d) => d.selected ? "red" : this.scColor(d) );
		tileSection.append( "text" )
			.text( d => d.key )
			.attr( "x", (d, i) => ((d.coords.x * this.tileSize.width) + (this.tileSize.width / 2)))
			.attr( "y", (d, i) => ((d.coords.y * this.tileSize.height) + (this.tileSize.height / 2)))
			.attr( "style", "font-size: " + this.tileSize.x * 1.25 + "px; font-family: 'Comic Sans MS', 'Papyrus', sans-serif;" );
		this.svg.append( "g" ).attr("id", "rectSelection").append( "rect" )
			.attr( "x", this.rectSelection.width > 0 ? this.rectSelection.x : this.rectSelection.x + this.rectSelection.width )
			.attr( "y", this.rectSelection.height > 0 ? this.rectSelection.y : this.rectSelection.y + this.rectSelection.height )
			.attr( "width", this.rectSelection.width > 0 ? this.rectSelection.width : -this.rectSelection.width )
			.attr( "height", this.rectSelection.height > 0 ? this.rectSelection.height : -this.rectSelection.height )
			.attr( "fill", "rgba(25, 50, 220, 0.5)" );
	},
}

window.addEventListener("load", () => {
	let svg = d3.select("#dragAndDropSelection")
		.attr( "width", W )
		.attr( "height", H );
	let selWin = new SelectionWindow(svg);
	selWin.init();
	selWin.update();
});