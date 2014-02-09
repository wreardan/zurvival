
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
	} catch(e) { }
}

Creature.prototype.createObject = function() {
	var T = this.THREE
	var body = new T.Object3D

    var head = new T.Mesh(
        new T.CubeGeometry(10, 10, 10),
        new T.MeshLambertMaterial({
            color: 0x800830,
            ambient: 0x800830
        })
    );
    head.position.set(0, 5, 0);
    body.add(head);

    var eyes = [0,1].map(function () {
        var eye = new T.Mesh(
            new T.CubeGeometry(1, 1, 1),
            new T.MeshLambertMaterial({
                color: 0xffffff,
                ambient: 0xffffff
            })
        );
        body.add(eye);
        return eye;
    });
    eyes[0].position.set(2, 8, 5);
    eyes[1].position.set(-2, 8, 5);

    this.body = body
    this.game.scene.add(body)
}

Creature.prototype.update = function() {
	
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
}

module.exports = Creature