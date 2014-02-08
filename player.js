require('./resourcetype.js');
require('./necessity.js');

function Player() {
	this.init();
}

Player.prototype.init = function() {
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

Player.prototype.makeResourceBundle = function() {
	var bundle = {};
	bundle.health = this.health;
	bundle.heat = this.heat.makeResourceBundle();
	bundle.sleep = this.sleep.makeResourceBundle();
	bundle.inventory = this.inventory.slice(0);
}

Player.prototype.updateFromBundle = function(bundle) {
	this.health = bundle.health;
	this.heat.updateFromBundle(bundle.heat);
	this.sleep.updateFromBundle(bundle.sleep);
	this.inventory = bundle.inventory;
}

module.exports = Player