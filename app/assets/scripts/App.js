var $ = require("jquery");

import technologies from "./modules/technologies";
import Grid from "./modules/grid";
import GridManager from "./modules/gridManager";
import GridController from "./modules/gridController";
import Monitor from "./modules/monitor";

document.addEventListener('DOMContentLoaded', function () {

	var mainGrid, monitor, gridManager, gridController;

	$("#create-grid").on("click", function(event){
		event.preventDefault();		
		clearInterval(interval);
		$(".tile").remove();

		let settings = {rows: 4, 
						columns: 8,
						slotSize: 75,
						blanks: $("#blanks").val(), 
						bgs: document.getElementById("tiled").checked? ["white", "#F6F7FB", "#EFF0F4"] : null,
						tracks: null
					};

		mainGrid = new Grid(settings, 'main-grid', technologies);
		monitor = new Monitor($("#monitor > ul"), mainGrid.technologies);
		gridManager = new GridManager(mainGrid, monitor);
		gridController = new GridController(gridManager);

		monitor.updateList();
	});

	var interval;

	$("#go").on("click", function(event){
		event.preventDefault();
		clearInterval(interval);

		interval = setInterval(startAction, 700);	
	});

	function startAction()
	{
		if(!gridController.manager.locked)
		{
			gridController.randomizer();
			gridController.manager.locked = true;
		}
	}

});