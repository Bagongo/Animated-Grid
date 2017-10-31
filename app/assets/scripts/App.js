var $ = require("jquery");

let technologies = {
	affinityDesign: "affinity_design.png",
	affinityPhoto: "affinity_photo.png",
	ajax: "ajax.png",
	android: "android.png",
	apache: "apache.png",
	bootstrap: "bootstrap.png",
	canon: "canon.png",
	capistrano: "capistrano.png",
	chrome: "chrome.png",
	coofee: "coofee.png",
	docker: "docker.png",
	duckduckgo: "duckduckgo.png",
	elasticsearch: "elasticsearch.png",
	firefox: "firefox.png",
	git: "git.png",
	github: "github.png",
	gitlab: "gitlab.png",
	goggleAnalitycs: "goggle_anal.png",
	google: "google.png",
	greensock: "greensock.png",
	groundwork: "groundwork.png",
	gulp: "gulp.png",
	gumby: "gumby.png",
	html: "html.png",
	javascript: "javascript.png",
	joomla: "joomla.png",
	jquery: "jquery.png",
	magento: "magento.png",
	mariadb: "mariadb.png",
	mongodb: "mongodb.png",
	mysql: "mysql.png",
	nginx: "nginx.png",
	nodejs: "nodejs.png",
	openproject: "openproject.png",
	openzfs: "openzfs.png",
	photoshop: "photoshop.png",
	php: "php.png",
	portainer: "portainer.png",
	postgresql: "postgresql.png",
	postman: "postman.png",
	rails: "rails.png",
	react: "react.png",
	redis: "redis.png",
	rocketchat: "rocketchat.png",
	ruby: "ruby.png",
	sass: "sass.png",
	semrush: "semrush.png",
	stackoverflow: "stackoverflow.png",
	sublimetext: "sublimetext.png",
	susy: "susy.png",
	telegram: "telegram.png",
	ubuntu: "ubuntu.png",
	unsplash: "unsplash.png",
	webpack: "webpack.png",
	wekan: "wekan.png",
	wordpress: "wordpress.png",
	xen: "xen.png"
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
    this.slotsX = settings.columns;
    this.slotsY = settings.rows;
    this.totalSlots = this.slotsX * this.slotsY;
    this.slotSize = settings.slotSize;
    this.technologies = [];
    this.initData(data);
    this.checkSettings();
  }

  checkSettings()
  {
  	if(this.totalSlots >= this.technologies.length)
  	{
  		console.log("Grid dimensions exceeded available technologies...");
  		return false
  	}

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

	constructor(grid, selector, monitor){
		this.grid = grid;
		this.frame = $("#" + selector);
		this.monitor = monitor;
		this.locked = false;

	    this.initGrid();
	    this.populateGrid();
	}

	initGrid()
	{
		this.frame.css({"width": (this.grid.slotsX * this.grid.slotSize) + "px",
						"height": (this.grid.slotsY * this.grid.slotSize) + "px"
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
		var $tile = $(this.buildHtmlObj(tech));
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

	buildHtmlObj(tech)
	{
		var localPath = "/assets/images/";
		return "<div><img src='" + localPath + tech.path + "' alt='" + tech.name + "' /></div>";
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

	randomizer(random)
	{
		var actionIdx, directionIdx, range, action, target, direction;

		if(random)
		{
			actionIdx = this.returnRandomInRange(0, 1);
			direction = this.ACTION_PARAMS[actionIdx].direction[this.returnRandomInRange(0,1)];
			action = this.ACTION_PARAMS[actionIdx].action;
			range = action === "row" ? this.grid.slotsY : this.grid.slotsX;
			target = this.returnRandomInRange(1, range);

			if(actionIdx === this.ACTION_PARAMS.last && target === this.ACTION_PARAMS[actionIdx].lastTarget)
			{
				this.randomizer(random);
				return;
			}
		}
		else
		{
			actionIdx = this.ACTION_PARAMS.last === 1 ? 0 : 1;
			directionIdx = this.ACTION_PARAMS[actionIdx].direction.last === 1 ? 0 : 1;
			this.ACTION_PARAMS[actionIdx].direction.last = directionIdx;
			direction = this.ACTION_PARAMS[actionIdx].direction[directionIdx];
			action = this.ACTION_PARAMS[actionIdx].action;
			range = action === "row" ? this.grid.slotsY : this.grid.slotsX;
			target = this.returnRandomInRange(1, range);
		}

		this.ACTION_PARAMS.last = actionIdx;	
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
			this.listElement.prepend("<li><img src='/assets/images/" + pathToItem + "' /> " + listItem + "</li>");
		}
	}

}

document.addEventListener('DOMContentLoaded', function () {

	let settings = {rows: 5, columns: 7, slotSize: 75};

	const mainGrid = new Grid(settings, technologies);
	const monitor = new Monitor($("#monitor > ul"), mainGrid.technologies);
	const gridManager = new GridManager(mainGrid, 'main-grid', monitor);
	const gridController = new GridController(gridManager, false, false);

	$("#go").on("click", function(e){
		e.preventDefault();

		var random = document.getElementById("randomize").checked;
		if(!gridController.manager.locked)
		{
			gridController.randomizer(random);
			gridController.manager.locked = true;
		}
	});

	monitor.updateList();
});