var $ = require("jquery");
let technologies = require("./modules/technologies.js");

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

  constructor (settings, data, selector) {    
    this.slotsX = settings.columns;
    this.slotsY = settings.rows;
    this.totalSlots = this.slotsX * this.slotsY;
    this.slotSize = settings.slotSize;
    this.tracks = settings.tracks;
    this.blanks = settings.blanks;
    this.tileBgs = settings.bgs;
    this.technologies = [];
	this.frame = $("#" + selector);
    this.initData(data);
    this.checkTracks(this.tracks);
    this.checkSlots();
    this.virtualGrid = this.createVirtualGrid();
    this.initGrid();
  }

  checkTracks(tracks)
  {
	if(!tracks)
		this.buildTracks();
	else
	{
		for(let i=0; i < this.tracks.row.length; i++)
		{
			if(this.tracks.row[i] > this.slotsY)
				console.log("Error in tracks count");
		}

		for(let j=0; j < this.tracks.column.length; j++)
		{
			if(this.tracks.column[j] > this.slotsX)
				console.log("Error in tracks count");
		}
	}
  }

  checkSlots()
  {
  	if(this.totalSlots >= this.technologies.length)
  		console.log("Grid dimensions exceeded available technologies...");
  }

  buildTracks()
  {
	  	this.tracks = {};
		this.tracks.row = [...Array(this.slotsY+1).keys()].slice(1);
		this.tracks.column = [...Array(this.slotsX+1).keys()].slice(1);
  }

  initData(data)
  {
  	var idx = this.blanks + 1;

  	for (let key in data) {
  		//add a blank every this.blank iterations
  		if(idx % this.blanks === 0)
  			this.technologies.push(new Technology("blank", "blank.png"));  			
	  		
  		var technology = new Technology(key, data[key]);
		this.technologies.push(technology);

		idx++;
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

  initGrid()
  {
	this.frame.css({"width": (this.slotsX * this.slotSize) + "px",
		"height": (this.slotsY * this.slotSize) + "px"
	});	
  }

  returnTech()
  {
 	 return this.technologies.shift();
  }

}

class GridManager {

	constructor(grid, monitor){
		this.grid = grid;
		this.monitor = monitor;
		this.locked = false;

	    this.populateGrid();
	}

	populateGrid()
	{
		for(let i=1; i < this.grid.virtualGrid.length - 1; i++)
		{
			for(let j=1; j < this.grid.virtualGrid[i].length - 1; j++)
			{
				if(this.grid.tracks["row"].includes(i) || this.grid.tracks["column"].includes(j))
				{   var tech = this.grid.returnTech();
					var slot = this.grid.virtualGrid[i][j];
					this.createAndInsertTile(tech, slot);				
				}
			}
		}
	}

	createAndInsertTile(tech, slot)
	{
		var $tile = $(this.buildHtmlObj(tech));
		$tile.addClass("tile");
		$tile.css({ "top": (slot.virtualCoords.y - 1) * this.grid.slotSize + "px", 
					"left": (slot.virtualCoords.x - 1) * this.grid.slotSize + "px",
					"width": this.grid.slotSize + "px", 
					"height": this.grid.slotSize + "px",
					"background": this.selectTileBg(tech)
		});

		slot.technology = tech;
		slot.tile = $tile;
		this.grid.frame.append($tile);
	}

	buildHtmlObj(tech)
	{
		var localPath = "./assets/images/";
		return "<div><img src='" + localPath + tech.path + "' alt='" + tech.name + "' /></div>";
	}

	selectTileBg(tech)
	{
		if(tech.name !== "blank" && this.grid.tileBgs)
			return this.grid.tileBgs[Math.floor(Math.random() * this.grid.tileBgs.length)];
		else 
			return "transparent";
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
				var lastTile = ((dir==="left" && i >= row.length - 1) 
							|| (dir==="right" && i >= row.length - 2)) ? 
								true : false;
				var tile = row[i].tile;
				var oldPosX = parseInt(tile.css("left"));
				var newPosX = (oldPosX + dirFactor * this.grid.slotSize) + "px";

				if(lastTile)
					tile.animate({"left": newPosX}).promise().done(function(){callback(row, dir)});
				else
					tile.animate({"left": newPosX});	
			}
		}
	}

	updateRow(row, dir)
	{
		var startingSlot = dir === "left" ? row[1] : row[row.length - 2];
		this.grid.technologies.push(startingSlot.technology);
		this.destroyTile(startingSlot.tile);

		this.monitor.updateList();

		if(dir === "left")
		{
			for(var i=1; i < row.length - 1; i++)
			{
				row[i].technology = row[i+1].technology;
				row[i].tile = row[i+1].tile;
			}

			this.clearSlot(row[row.length - 1]);
		}
		else
		{
			for(var i = row.length - 2; i >= 1; i--)
			{
				row[i].technology = row[i-1].technology;
				row[i].tile = row[i-1].tile;
			}

			this.clearSlot(row[0]);
		}

		this.endSequence();
	}

	prepColumn(colIdx, dir)
	{
		var vGrid = this.grid.virtualGrid;
		var slotToFill = dir === "up" ? vGrid[vGrid.length - 1][colIdx] : vGrid[0][colIdx];
		var newTech = this.grid.returnTech();
		this.createAndInsertTile(newTech, slotToFill);
		this.moveColumn(colIdx, dir);
	}

	moveColumn(colIdx, dir)
	{
		var vGrid = this.grid.virtualGrid;
		var span = dir==="up" ? vGrid.length - 1 : vGrid.length - 2;
		var dirFactor = dir === "up" ? -1 : 1;
		
		var callback = this.updateColumn.bind(this);
		
		for(let i=0; i < vGrid.length; i++)
		{
			if(vGrid[i][colIdx].hasOwnProperty("tile"))
			{
				var lastTile = i >= span ? true : false; 
				var tile = vGrid[i][colIdx].tile;
				var oldPosY = parseInt(tile.css("top"));
				var newPosY = (oldPosY + dirFactor * this.grid.slotSize) + "px";

				if(lastTile)
					tile.animate({"top": newPosY}).promise().done(function(){callback(colIdx, dir)});
				else
					tile.animate({"top": newPosY});	
			}
		}

	}

	updateColumn(colIdx, dir)
	{
		var vGrid = this.grid.virtualGrid;
		var slotToDel = dir === "up" ? vGrid[1][colIdx] : vGrid[vGrid.length - 2][colIdx];

		this.grid.technologies.push(slotToDel.technology);
		this.destroyTile(slotToDel.tile);

		this.monitor.updateList();

		if(dir === "up")
		{
			for(let i=1; i < vGrid.length - 1; i++)
			{
				vGrid[i][colIdx].technology = vGrid[i+1][colIdx].technology;
				vGrid[i][colIdx].tile = vGrid[i+1][colIdx].tile;
			}

			this.clearSlot(vGrid[vGrid.length - 1][colIdx]);
		}
		else
		{
			for(let i = vGrid.length - 2; i >= 1; i--)
			{
				vGrid[i][colIdx].technology = vGrid[i-1][colIdx].technology;
				vGrid[i][colIdx].tile = vGrid[i-1][colIdx].tile;
			}

			this.clearSlot(vGrid[0][colIdx]);
		}

		this.endSequence();
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

	endSequence()
	{
		this.locked = false;
	}
}

class GridController{

	constructor(gridMan){
		this.manager = gridMan;
		this.grid = this.manager.grid;

		this.ACTION_PARAMS = {	
			last: null,	
			0: {action: "row", lastTarget: null, direction: {0: "left", 1: "right", last: null}},
			1: {action: "column", lastTarget: null, direction: {0: "up", 1: "down", last: null}}
		};
	}

	startAction(action, target, dir)
	{
		if(action === "row")
			this.manager.prepRow(target, dir);
		else
			this.manager.prepColumn(target, dir);
	}

	randomizer()
	{
		var actionIdx, directionIdx, action, targetRange, targetIdx, target, direction;
		var tracks = this.grid.tracks;

		actionIdx = this.returnRandomInRange(0, 1);
		direction = this.ACTION_PARAMS[actionIdx].direction[this.returnRandomInRange(0,1)];
		action = this.ACTION_PARAMS[actionIdx].action;
		targetRange = tracks[action].length - 1;
		targetIdx = this.returnRandomInRange(0, targetRange);
		target = tracks[action][targetIdx];

		if(action === this.ACTION_PARAMS.last && target === this.ACTION_PARAMS[actionIdx].lastTarget)
		{
			this.randomizer();
			return;
		}
		
		this.ACTION_PARAMS.last = action;	
		this.ACTION_PARAMS[actionIdx].lastTarget = target;

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
			let pathToItem = this.list[i].path;
			this.listElement.prepend("<li><img src='./assets/images/" + pathToItem + "' /> " + listItem + "</li>");
		}
	}

}

document.addEventListener('DOMContentLoaded', function () {

	var mainGrid, monitor, gridManager, gridController;

	$("#create-grid").on("click", function(event){
		event.preventDefault();

		$(".tile").remove();

		let settings = {rows: 5, 
						columns: 10,
						slotSize: 75,
						blanks: $("#blanks").val(), 
						bgs: document.getElementById("tiled").checked? ["darkgrey", "grey", "lightgrey"] : null,
						tracks: {row: [2, 3], column: [4, 8]}
					};

		mainGrid = new Grid(settings, technologies, 'main-grid');
		monitor = new Monitor($("#monitor > ul"), mainGrid.technologies);
		gridManager = new GridManager(mainGrid, monitor);
		gridController = new GridController(gridManager);

		monitor.updateList();
	});

	$("#go").on("click", function(event){
		event.preventDefault();

		if(!gridController.manager.locked)
		{
			gridController.randomizer();
			gridController.manager.locked = true;
		}
	});
});