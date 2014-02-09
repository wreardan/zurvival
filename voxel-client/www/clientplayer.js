var Player = require('../../player.js');
var ClientNecessity = require('./clientnecessity.js');

function ClientPlayer(healthEl, sleepEl, timeEl) {
	Player.call(this); //call superconstructor
	this.healthEl = healthEl;
	this.sleep = new ClientNecessity(this.sleep, sleepEl);
	this.timeEl = timeEl;

}

ClientPlayer.prototype = new Player();

ClientPlayer.prototype.update = function() {
	this.healthEl.innerHTML = ""+this.health;
	this.timeEl.innerHTML = ""+Math.floor(Date.now() - this.spawnTime)/100;
	Player.prototype.update.call(this);

	try {
		postprocessor.passes[1].uniforms.dreamvision.value = 1.0-this.sleep.getValue();
		postprocessor.passes[1].uniforms.bloodvision.value = 1.0 - this.health/100;
		postprocessor.passes[1].uniforms.time.value = (Date.now()) / 100.0;
	} catch(e) {}

}

module.exports = ClientPlayer;