var $ = require("jquery");

let tiles = {
    aqua: "#00ffff",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    black: "#000000",
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lightblue: "#add8e6",
    lightcyan: "#e0ffff",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    white: "#ffffff",
    yellow: "#ffff00"
};

// alert(Object.keys(tiles).length);

class Grid {

  constructor (settings, data) {    
    this.slotsX = settings.slots.x;
    this.slotsY = settings.slots.y;
    this.totalSlots = this.slotsX * this.slotsY;
    this.slotSize = settings.slotSize;
    this.technologies = [];
    this.initData(data);
    this.virtualGrid = this.createVirtualGrid();
  }

  initData(data)
  {
  	for (let key in data) {
  		let tile = new Tile(key, data[key], this.slotSize, null);
		this.technologies.push(tile);
	}
  }

  createVirtualGrid()
  {
  	var vGrid = [];
  	var row = [];
  	var idx = 0;

  	for(let i=0; i <= this.slotsY + 1; i++)
  	{
		for(let j=0; j <= this.slotsX + 1; j++)
		{
			var newTile = {};

			if(i > 0 && i < this.slotsY + 1 && j > 0 && j < this.slotsX + 1){
				newTile = this.technologies[idx];
				idx++;
			}
			else
				newTile = new Tile(null, null, null, null);
			
			newTile.virtualCoords = {x: j, y: i};

			row.push(newTile);
		}

		vGrid.push(row);
		row = [];
  	}

  	return vGrid;
  }

  returnTech()
  {
 	 return this.technologies.shift();
  }

}

class Tile{

	constructor(name, tech, size, vCoords){
		this.name = name;
		this.tech = tech;
		this.size = size;
		this.virtualCoords = vCoords;
	}

	initRealCoords()
	{
		this.realCoords = {x: (this.virtualCoords.x - 1) * this.size, y: (this.virtualCoords.y - 1) * this.size};
	}

	calcNewCoords()
	{
	}
}

class GridManager {

	constructor(grid, selector){
		this.grid = grid;
		this.frame = document.getElementById(selector);

	    this.initGrid();
	    this.populateGrid();
	}

	initGrid()
	{
		this.frame.style.width = (this.grid.slotsX * this.grid.slotSize) + "px";
		this.frame.style.height = (this.grid.slotsY * this.grid.slotSize) + "px";
	}

	populateGrid()
	{
		for(let i=0; i < this.grid.virtualGrid.length; i++)
		{
			for(let j=0; j < this.grid.virtualGrid[i].length; j++)
			{
				if(this.grid.virtualGrid[i][j].name !== null)
				{
					var tile = this.grid.virtualGrid[i][j];
					this.insertTile(tile);
				}
			}
		}
	}

	insertTile(tile)
	{
		tile.initRealCoords();

		var tileDiv = document.createElement("div");
		tileDiv.className= "tile";
		tileDiv.style.top = tile.realCoords.y + "px";
		tileDiv.style.left = tile.realCoords.x + "px";
		tileDiv.style.width = tile.size + "px";
		tileDiv.style.height = tile.size + "px";
		tileDiv.style.background = tile.tech;

		tile.div = tileDiv;
		this.frame.appendChild(tileDiv);
	}

	prepRow(rowIdx, dir)
	{
		let row = this.grid.virtualGrid[rowIdx];
		let slotToPopulate = dir === "left" ? row.length - 1 : 0;
		let newTile = this.grid.returnTech();
		newTile.virtualCoords = {x: slotToPopulate, y: rowIdx};
		row[slotToPopulate] = newTile;
		this.insertTile(newTile);

		this.moveRow(row, dir);
	}

	moveRow(row, dir)
	{  
		for(let i=0; i < row.length; i++)
		{
			if(row[i].hasOwnProperty("div"))
				row[i].div.classList.add("move");
		}

		var dirFactor = dir === "left" ? -1 : 1;
		var callback = this.updateRow;

		$(".move").animate({"margin-left": this.grid.slotSize * dirFactor})
					.promise().done(function(){callback(row, dir);});
	}

	updateRow(row, dir)
	{
		$(".move").removeClass("move");
		console.log("done");
	}

}

document.addEventListener('DOMContentLoaded', function () {

	let settings = {slots:{x:5, y:5},
					slotSize: 50
				};

  const mainGrid = new Grid(settings, tiles);
  const gridManager = new GridManager(mainGrid, 'main-grid');

  gridManager.prepRow(3, "right");

});




