function ClientCreature(game, bundle) {
	this.game = game
	this.THREE = game.THREE

	this.createObject();
	this.index = bundle.index;
	this.updateFromBundle(bundle);
}

ClientCreature.prototype.createObject = function() {
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

    //drawable object
	this.body = body
	this.game.scene.add(body)

	//setup physics
/*
	var dims = new T.Vector3(5,5,5)
	var force = new T.Vector3(0, -0.00009, 0)
	this.physics = game.makePhysical(body, dims)
	this.physics.subjectTo(force)
*/
}

ClientCreature.prototype.updateFromBundle = function(bundle) {
	this.body.position.x = bundle.position[0]
	this.body.position.y = bundle.position[1]
	this.body.position.z = bundle.position[2]

	this.health = bundle.health;

	this.body.rotation.y = bundle.rotation;
}

module.exports = ClientCreature;

