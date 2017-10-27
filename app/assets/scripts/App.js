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

class Technology{
	constructor(name, path){
		this.name = name,
		this.path = path
	}
}

class Slot{
	constructor(x, y){
		this.virtualCoords = {x: x, y: y};
	}
}

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
  		var technology = new Technology(key, data[key]);
		this.technologies.push(technology);
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
			var newSlot = new Slot(j, i);
			row.push(newSlot);
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
		for(let i=1; i < this.grid.virtualGrid.length - 1; i++)
		{
			for(let j=1; j < this.grid.virtualGrid[i].length - 1; j++)
			{
				var tech = this.grid.returnTech();
				var slot = this.grid.virtualGrid[i][j];
				this.createAndInsertTile(tech, slot);				
			}
		}

		console.log(this.grid.virtualGrid);
	}

	createAndInsertTile(tech, slot)
	{
		var tile = document.createElement("div");
		tile.classList.add("tile");
		tile.style.top = (slot.virtualCoords.y - 1) * this.grid.slotSize + "px";
		tile.style.left = (slot.virtualCoords.x - 1) * this.grid.slotSize + "px";
		tile.style.width = this.grid.slotSize + "px";
		tile.style.height = this.grid.slotSize + "px";
		tile.style.background = tech.path;

		slot.technology = tech;
		slot.tile = tile;

		this.frame.appendChild(tile);
	}

	prepRow(rowIdx, dir)
	{
		var row = this.grid.virtualGrid[rowIdx];
		var slotToFill = dir === "left" ? row[row.length - 1] : row[0];
		var newTech = this.grid.returnTech();
		
		this.createAndInsertTile(newTech, slotToFill);
		this.moveRow(row, dir);
	}

	moveRow(row, dir)
	{  
		for(let i=0; i < row.length; i++)
		{
			if(row[i].hasOwnProperty("tile"))
				row[i].tile.classList.add("move");
		}

		var dirFactor = dir === "left" ? -1 : 1;
		$(".move").animate({"margin-left": this.grid.slotSize * dirFactor})
					.promise().done(() => this.updateRow(row, dir));
	}

	updateRow(row, dir)
	{
		//push 'first' tech to technologies
		//loop row to move value in slots (start from 'second' into first until second to last)
		//clear 'last'

		console.log(this.grid.virtualGrid);

		$(".move").removeClass("move");	
	}

}

document.addEventListener('DOMContentLoaded', function () {

	let settings = {slots:{x:5, y:5},
					slotSize: 50
				};

  const mainGrid = new Grid(settings, tiles);
  const gridManager = new GridManager(mainGrid, 'main-grid');

  gridManager.prepRow(1, "left");

});




