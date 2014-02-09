var ResourceType = require('./resourcetype.js');
var Necessity = require('./necessity.js');

function Player() {
	this.init();
}

Player.prototype.reset = function() {
	this.health = 100;
	this.heat = new Necessity(120000)
	this.sleep = new Necessity(180000)
}

Player.prototype.init = function() {
	this.reset()
	/*
	, function(heat) {
		console.log("You died of hypothermia");
		heat.fill();
	});
*/
	/*
	, function(sleep) {
		console.log("You died of exhaustion");
		sleep.fill();
	});
*/
	this.inventory = makeInventory();
}

function makeInventory() {
	var inv = new Array(ResourceType.resourceTypes.length);
	for (var c = 0; c < ResourceType.resourceTypes.length; c++) {
		inv[c] = 0;
	}
	return inv;
}

Player.prototype.update = function() {
	//update
	var flag = false
	flag = this.sleep.update() || flag
	flag = this.heat.update() || flag
	flag = this.health <= 0 || flag
	//Check for Death
	return flag
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