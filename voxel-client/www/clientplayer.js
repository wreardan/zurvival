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

	try {
		postprocessor.passes[1].uniforms.dreamvision.value = 1.0-this.sleep.getValue();
		postprocessor.passes[1].uniforms.bloodvision.value = 1.0 - this.health/100;
		postprocessor.passes[1].uniforms.frostvision.value = 1.0-this.heat.getValue();
		//Not sure if this should go here???
		var d = new Date();
		postprocessor.passes[1].uniforms.time.value = (d.getTime()) / 100.0;
		delete d; //probably a bad way to do this???
	} catch(e) {}

}

module.exports = ClientPlayer;