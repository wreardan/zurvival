function Player() {
	this.health = 1;
	this.heat = new Necessity(60000);
	this.sleep = new Necessity(120000);
	this.inventory = makeInventory();
}

function makeInventory() {
	var inv = new Array(resourceTypes.length);
	for (var c = 0; c < resourceTypes.length; c++) {
		inv[c] = 0;
	}
	return inv;
}