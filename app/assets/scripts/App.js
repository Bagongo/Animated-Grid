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
    this.rows = settings.rows;
    this.columns = settings.columns;
    this.totalSlots = this.rows * this.columns;
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

  	for(let i=0; i <= this.columns + 1; i++)
  	{
		for(let j=0; j <= this.rows + 1; j++)
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
		this.frame = $("#" + selector);

	    this.initGrid();
	    this.populateGrid();
	}

	initGrid()
	{
		this.frame.css({"width": (this.grid.rows * this.grid.slotSize) + "px",
						"height": (this.grid.columns * this.grid.slotSize) + "px"
		});
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
	}

	createAndInsertTile(tech, slot)
	{
		var $tile = $("<div></div>");
		$tile.addClass("tile");
		$tile.css({ "top": (slot.virtualCoords.y - 1) * this.grid.slotSize + "px", 
					"left": (slot.virtualCoords.x - 1) * this.grid.slotSize + "px",
					"width": this.grid.slotSize + "px", 
					"height": this.grid.slotSize + "px",
					"background": tech.path
		});

		slot.technology = tech;
		slot.tile = $tile;
		this.frame.append($tile);
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
		var dirFactor = dir === "left" ? -1 : 1;
		var callback = this.updateRow.bind(this);

		for(let i=0; i < row.length; i++)
		{
			if(row[i].hasOwnProperty("tile"))
			{
				var tile = row[i].tile;
				var oldPosX = parseInt(tile.css("left"));
				var newPosX = (oldPosX + dirFactor * this.grid.slotSize) + "px";
				tile.animate({"left": newPosX})
					.promise()
					.done(function(){callback(row, dir);});
			}
		}
	}

	updateRow(row, dir)
	{
		var startingSlot = dir === "left" ? row[1] : row[row.length - 2];
		this.grid.technologies.push(startingSlot.technology);
		this.destroyTile(startingSlot.tile);

		console.log("ds");

		// if(dir === "left")
		// {
		// 	for(var i=1; i < row.length - 1; i++)
		// 	{
		// 		row[i].technology = row[i+1].technology;
		// 		row[i].tile = row[i+1].tile;
		// 	}

		// 	this.clearSlot(row[row.length - 1]);
		// }
		// else
		// {
		// 	for(var i = row.length - 2; i >= 1; i--)
		// 	{
		// 		row[i].technology = row[i-1].technology;
		// 		row[i].tile = row[i-1].tile;
		// 	}

		// 	this.clearSlot(row[0]);
		// }
	}

	clearSlot(slot)
	{
		delete slot.technology;
		delete slot.tile;
	}

	destroyTile(tile)
	{
		tile.remove();
	}
}

class GridController{

	constructor(gridMan, altTarget, altDir){
		this.manager = gridMan;
		this.grid = this.manager.grid;

		this.ACTION_PARAMS = {	
		  0: {action: "row", direction: {0: "left", 1: "right"}},
		  1: {action: "column", direction: {0: "up", 1: "down"}}
		}

		this.alternateTarget = altTarget;
		this.alternateDirection = altDir;
		this.lastAction = 0;
		this.lastDirection = 0; 
	}

	startAction(action, target, dir)
	{
		if(action === "row")
			this.manager.prepRow(target, dir);
	}

	randomizer(altAction, altDir)
	{
		var actionIdx, directionIdx, action, target, direction;

		if(altAction)
		{
			actionIdx = this.lastAction === 0 ? 1 : 0;
			this.lastTarget = actionIdx;
		}
		else
			actionIdx = this.returnRandomInRange(0, 1);

		if(altDir)
		{
			directionIdx = this.lastDirection === 0 ? 1 : 0;
			this.lastDirection = directionIdx;
		}
		else
			directionIdx = this.returnRandomInRange(0, 1);

		var action = this.ACTION_PARAMS[actionIdx]["action"];
		var direction = this.ACTION_PARAMS[actionIdx]["direction"][directionIdx];

		if(action === "row")
			target = this.returnRandomInRange(1, this.grid.rows);
		else
			target = this.returnRandomInRange(1, this.grid.columns);

		this.startAction(action, target, direction);
	}

	returnRandomInRange(min, max)
	{
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

class Monitor{
	constructor(listEl, list)
	{
		this.listElement = listEl;
		this.list = list;
	}

	updateList()
	{
		this.listElement.empty();

		for(let i=0; i < this.list.length; i++)
		{
			let listItem = this.list[i].name;
			this.listElement.prepend("<li>" + listItem + "</li>");
		}
	}

}


document.addEventListener('DOMContentLoaded', function () {

	let settings = {rows: 5, columns: 5, slotSize: 50};

	const mainGrid = new Grid(settings, tiles);
	const gridManager = new GridManager(mainGrid, 'main-grid');
	const monitor = new Monitor($("#monitor > ul"), gridManager.grid.technologies);
	const gridController = new GridController(gridManager, false, false);

	$("#go").on("click", function(e){
		e.preventDefault();
		gridController.startAction("row", 1, "right");
	});
});




