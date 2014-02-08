var ResourceType = require('./resourcetype.js');
var Necessity = require('./necessity.js');

function Player() {
	this.init();
}

Player.prototype.init = function() {
	var die = function() {
		this.fill();
		alert('you died!');
	}
	this.health = 100;
	this.heat = new Necessity(6000, die);
	this.sleep = new Necessity(12000, die);
	this.inventory = makeInventory();
}

function makeInventory() {
	var inv = new Array(ResourceType.resourceTypes.length);
	for (var c = 0; c < ResourceType.resourceTypes.length; c++) {
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
	return bundle;
}

Player.prototype.updateFromBundle = function(bundle) {
	this.health = bundle.health;
	this.heat.updateFromBundle(bundle.heat);
	this.sleep.updateFromBundle(bundle.sleep);
	this.inventory = bundle.inventory;
}

module.exports = Player