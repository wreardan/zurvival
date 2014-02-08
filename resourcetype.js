require('./resource.js');

resourceTypes = new Array();

function ResourceType() {
	this.id = resourceTypes.length;
	resourceTypes.push(this);
}

ResourceType.prototype.create = function(position) {
	return new Resource(position, this);
}

ResourceType.resourceTypes = resourceTypes;

module.exports = ResourceType;
