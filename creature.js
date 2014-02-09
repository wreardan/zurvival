
function Creature(game, opts) {
	if(!opts) opts = {}

	this.game = game
	this.THREE = game.THREE

	this.health = 0
	this.position = new this.THREE.Vector3(0,0,0)
	this.rotation = 0

	try {
		document;

		console.log('creating creature')

		this.createObject()
		this.body.position = this.position
	} catch(e) { }
}

Creature.prototype.createObject = function() {
	var T = this.THREE
	var body = new T.Object3D

    var head = new T.Mesh(
        new T.CubeGeometry(5, 5, 5),
        new T.MeshLambertMaterial({
            color: 0x83F52C,
            ambient: 0x83F52C
        })
    );
    head.position.set(0, 3, 0);
    body.add(head);

    var eyes = [0,1].map(function () {
        var eye = new T.Mesh(
            new T.CubeGeometry(0.5, 0.5, 0.5),
            new T.MeshLambertMaterial({
                color: 0xffffff,
                ambient: 0xffffff
            })
        );
        body.add(eye);
        return eye;
    });
    eyes[0].position.set(1, 4, 2.5);
    eyes[1].position.set(-1, 4, 2.5);

    this.body = body
    this.game.scene.add(body)
}

Creature.prototype.update = function() {
	
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
	return bundle
}

Creature.prototype.updateFromBundle = function(bundle) {
	this.position.x = bundle.position[0]
	this.position.y = bundle.position[1]
	this.position.z = bundle.position[2]

	this.rotation = bundle.rotation

	this.body.rotation.y = this.rotation
}

module.exports = Creature