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

export default Monitor;