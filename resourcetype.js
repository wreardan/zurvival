resourceTypes = array();

function ResourceType() {
	this.id = resourceTypes.size();
	resourceTypes.add(this);
	Inventory.prototype[this.id] = 0;
}

function create(position) {
	return new Resource(position, this);
}
