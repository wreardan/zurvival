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
	postprocessor.passes[1].uniforms.dreamvision.value = 1.3-this.sleep.getValue();
	postprocessor.passes[1].uniforms.bloodvision.value = 1.3-this.health;
	postprocessor.passes[1].uniforms.frostvision.value = 10*(1.3-this.heat.getValue());
	//Not sure if this should go here???
	var d = new Date();
	postprocessor.passes[1].uniforms.time.value = (d.getTime() % 4096) / 10.0;
	delete d; //probably a bad way to do this???
}

module.exports = ClientPlayer;