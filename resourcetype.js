require('./resource')();

resourceTypes = new Array();

function ResourceType() {
	this.id = resourceTypes.length;
	resourceTypes.push(this);
}

function create(position) {
	return new Resource(position, this);
}
