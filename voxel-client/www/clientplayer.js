var Player = require('../../player.js');
var ClientNecessity = require('./clientnecessity.js');

function ClientPlayer(healthEl, heatEl, sleepEl) {
	Player.call(this); //call superconstructor
	this.healthEl = healthEl;
	this.heat = new ClientNecessity(this.heat, heatEl);
	this.sleep = new ClientNecessity(this.sleep, sleepEl);
}

ClientPlayer.prototype = new Player();

ClientPlayer.prototype.update = function() {
	this.healthEl.innerHTML = ""+this.health;
	Player.prototype.update.call(this);
}

module.exports = ClientPlayer;