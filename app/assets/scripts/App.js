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
    this.allTechs = [];
    this.offGridTechs = [];
    this.initData(data);
    this.virtualGrid = this.createVirtualGrid();
  }

  initData(data)
  {
  	for (let key in data) {
  		let tile = new Tile(key, data[key], this.slotSize, null);
		this.allTechs.push(tile);
	}
  }

  storeRemaingingTechs(idx)
  {
	for(let i=idx; i < this.allTechs.length; i++)
		this.offGridTechs.push(this.allTechs[i]);
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
				newTile = this.allTechs[idx];
				idx++;
			}
			else
				newTile = new Tile(null, null, null, null);
			
			newTile.virtualCoords = {x: j, y: i};
			newTile.initRealCoords();

			row.push(newTile);
		}

		vGrid.push(row);
		row = [];
  	}

  	this.storeRemaingingTechs(idx);

  	return vGrid;
  }

  returnRandomTech()
  {
  	 return this.offGridTechs[Math.floor(Math.random() * this.offGridTechs.length)];
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
					var slotElement = this.grid.virtualGrid[i][j];
					this.drawTile(slotElement.realCoords.x, slotElement.realCoords.y, slotElement.size, slotElement.tech);
				}
			}
		}
	}

	drawTile(x, y, size, color)
	{
		var tile = document.createElement("div");

		tile.className= "tile";
		tile.style.top = y + "px";
		tile.style.left = x + "px";
		tile.style.width = size + "px";
		tile.style.height = size + "px";
		tile.style.background = color;

		this.frame.appendChild(tile);
	}

	prepRow(rowIdx, dir)
	{
		let row = this.grid.virtualGrid[rowIdx];
		let slotToPopulate = dir == -1 ? 0 : row.length - 1;
		let newTile = this.grid.returnRandomTech();
		newTile.virtualCoords = {x: slotToPopulate, y: rowIdx};
		newTech.calcNewCoords();
		row[slotToPopulate] = newTile;
	}

	updateRow()
	{

	}

}

document.addEventListener('DOMContentLoaded', function () {

	let settings = {slots:{x:5, y:5},
					slotSize: 100
				};

  const mainGrid = new Grid(settings, tiles);
  const gridManager = new GridManager(mainGrid, 'main-grid');

});




