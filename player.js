var ResourceType = require('./resourcetype.js');
var Necessity = require('./necessity.js');

function Player() {
	this.init();
}

Player.prototype.reset = function() {
	this.spawnTime = Date.now();
	this.health = 10000;
	this.sleep = new Necessity(30000)
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
	flag = this.health <= 0 || flag
	//Check for Death
	return flag
}

Player.prototype.makeResourceBundle = function() {
	var bundle = {};
	bundle.health = this.health;
	bundle.sleep = this.sleep.makeResourceBundle();
	bundle.inventory = this.inventory.slice(0);
	bundle.timeAlive = Date.now() - this.spawnTime;
	return bundle;
}

Player.prototype.updateFromBundle = function(bundle) {
	this.health = bundle.health;
	this.sleep.updateFromBundle(bundle.sleep);
	this.inventory = bundle.inventory;
	this.spawnTime = Date.now() - bundle.timeAlive;
}

module.exports = Player