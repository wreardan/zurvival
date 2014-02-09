var count = 0;

function Creature(game) {

	this.game = game
	this.THREE = game.THREE

	this.index = count++;

	this.health = 0
	this.position = new game.THREE.Vector3(0,30,0)
	this.rotation = 0
}

Creature.prototype.update = function() {
	var scalar = 0.2
	this.position.x += Math.sin(this.rotation) * scalar
	this.position.z += Math.cos(this.rotation) * scalar
}

Creature.prototype.face = function(obj) {
	var a = obj.position || obj
	var b = this.position

	this.rotation = Math.atan2(a.x - b.x, a.z - b.z)
		+ Math.random() * 1/4 - 1/8
}

Creature.prototype.makeBundle = function() {
	var bundle = {}
	var position = this.position
	bundle.position = [position.x, position.y, position.z]
	bundle.rotation = this.rotation
	bundle.health = this.health;
	bundle.index = this.index;
	return bundle
}

Creature.prototype.distanceTo = function(position) {
	var dx = position.x - this.position.x
	var dy = position.y - this.position.y	//not currently used
	var dz = position.z - this.position.z
	var dist = Math.sqrt(dx*dx + dz*dz)
	return dist
}

module.exports = Creature