var $ = require("jquery");

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
				{   
					var slot = this.grid.virtualGrid[i][j];
					this.createAndInsertTile(slot);				
				}
			}
		}
	}

	createAndInsertTile(slot)
	{
		var tech = this.grid.returnTech();
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
		this.createAndInsertTile(slotToFill);
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
		this.createAndInsertTile(slotToFill);
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

export default GridManager;