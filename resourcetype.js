resourceTypes = array();

function ResourceType() {
	this.id = resourceTypes.size();
	resourceTypes.add(this);
}

function create(position) {
	return new Resource(position, this);
}
