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

export default GridController;

