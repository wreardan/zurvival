/**
 * A Necessity will deplete over time.
 */
function Necessity(timeToDeplete, onZero) {
	this.lastTimeRefreshed = Date.now();
	this.timeToDeplete = timeToDeplete;
	this.onZero = onZero;
}

/* fills the necessity bar completely */
Necessity.prototype.fill = function() {
	this.lastTimeRefreshed = Date.now();
}

/* adds a percentage to the count */
Necessity.prototype.add = function(amount) {
	this.lastTimeRefreshed =
		Math.max(
			this.lastTimeRefreshed + Math.ceil(this.timeToDeplete * amount),
			Date.now());
}

/* returns a value between -infinity and 1, with 1 being full and 0 being empty. */
Necessity.prototype.getValue = function() {
	return 1 - (Date.now() - this.lastTimeRefreshed)/this.timeToDeplete;
}

/* calls onZero() if value < 0 */
Necessity.prototype.update = function() {
	if (this.getValue() <= 0 && this.onZero != undefined) {
		this.onZero(this);
	}
}

Necessity.prototype.makeResourceBundle = function() {
	var bundle = {};
	bundle.time = Date.now() - this.lastTimeRefreshed;
	bundle.total = this.timeToDeplete;
	return bundle;
}

Necessity.prototype.updateFromBundle = function(resourceBundle) {
	this.lastTimeRefreshed = Date.now() - resourceBundle.time;
}

module.exports = Necessity;
