require('../../necessity.js');

function ClientNecessity(baseNecessity, domEl) {
	this.lastTimeRefreshed = baseNecessity.lastTimeRefreshed;
	this.timeToDeplete = baseNecessity.timeToDeplete;
	this.domEl = domEl;
}

ClientNecessity.prototype = new Necessity();

ClientNecessity.prototype.update = function() {
	Necessity.prototype.update.call(this); //super.update();
	this.domEl.innerHTML = ""+this.getValue();
}