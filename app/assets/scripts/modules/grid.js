var $ = require("jquery");
import Technology from "./technology";
import Slot from "./slot";

class Grid {

    constructor (settings, data, selector) {    
        this.slotsX = settings.columns;
        this.slotsY = settings.rows;
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
    				console.error("Error in tracks count");
    		}

    		for(let j=0; j < this.tracks.column.length; j++)
    		{
    			if(this.tracks.column[j] > this.slotsX)
    				console.error("Error in tracks count");
    		}
    	}
    }

    checkSlots()
    {
        var totalSlots = this.tracks.row.length * this.slotsY + this.tracks.column.length * this.slotsX;
        if(totalSlots >= this.technologies.length)
            console.error("Grid dimensions exceeded available technologies...");
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

export default Grid;






