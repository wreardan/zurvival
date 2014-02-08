var Necessity = require('../../necessity.js');

function ClientNecessity(baseNecessity, domEl) {
	this.lastTimeRefreshed = baseNecessity.lastTimeRefreshed;
	this.timeToDeplete = baseNecessity.timeToDeplete;
	this.domEl = domEl;
}

ClientNecessity.prototype = new Necessity();

ClientNecessity.prototype.update = function() {
	Necessity.prototype.update.call(this); //super.update();
	var percentage = Math.floor(this.getValue() * 100);
	this.domEl.innerHTML = ""+percentage;
}

module.exports = ClientNecessity;