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
	postprocessor.passes[1].uniforms.dreamvision.value = 1.0-this.heat.getValue();
	postprocessor.passes[1].uniforms.bloodvision.value = 1.0-this.sleep.getValue();
	
}

module.exports = ClientPlayer;