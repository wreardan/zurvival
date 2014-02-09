var createClient = require('../')
var highlight = require('voxel-highlight')
var extend = require('extend')
var voxelPlayer = require('voxel-player')
var voxelpp = require('voxel-pp')
var ClientCreature = require('./clientcreature.js')

//var postprocessor

var game
var createCreature

creatures = []

module.exports = function(opts, setup) {
  setup = setup || defaultSetup
  opts = extend({}, opts || {})

  var client;
  if(document.URL.search("localhost") == -1)
    client = createClient(opts.server || "ws://test.worldwebcraft.com/")
  else
    client = createClient(opts.server || "ws://localhost:8080/")
  
  client.emitter.on('noMoreChunks', function(id) {
    console.log("Attaching to the container and creating player")
    var container = opts.container || document.body
    game = client.game
    game.appendTo(container)
    if (game.notCapable()) return game
    var createPlayer = voxelPlayer(game)

    // create the player from a minecraft skin file and tell the
    // game to use it as the main player
    var avatar = createPlayer('player.png')
    window.avatar = avatar
    avatar.possess()
    var settings = game.settings.avatarInitialPosition
    avatar.position.set(settings[0],settings[1],settings[2])
    setup(game, avatar, client)


    //try to add post-proc????
    var shaderRequest = new XMLHttpRequest();
    shaderRequest.onload = function() {
      postprocessor = voxelpp(game)
      postprocessor.use({fragmentShader: this.responseText,
        uniforms: {
          dreamvision: {type: 'f', value: 0.0},
          bloodvision: {type: 'f', value: 0.5},
          frostvision: {type: 'f', value: 0.0},
          time: {type: 'f', value: 0.0}}})
    }
    shaderRequest.open("GET", "./postproc.fs")
    shaderRequest.send()

    client.emitter.on('creatureDestroy', function(index) {
      var creature = creatures.splice(index, 1)[0];
      game.scene.remove(creature.body);
    })
//initialize creature creation module
/*
    createCreature = require('voxel-creature')(game)

    var creature = createCreature((function () {
      var T = game.THREE
      var body = new T.Object3D

      var head = new T.Mesh(
        new T.CubeGeometry(10, 10 10),
        new T.MeshLambertMaterial({
          color: 0x800830,
          ambient: 0x800830
        }));
      head.position.set(0,5,0)
      body.add(head)

      var eyes = [0,1].map(function () {
        var eye = new T.Mesh(
          new T.CubeGeometry(1,1,1),
          new T.MeshLambertMaterial({
            color: 0x800830,
            ambient: 0x800830
          })
        );
        body.add(eye)
        return eye
      });
      eyes[0].position.set(2,8,5)
      eyes[1].position.set(-2,8,5)
      return body
    }))()
*/

  })


  return game
}

function defaultSetup(game, avatar, client) {
  // highlight blocks when you look at them, hold <Ctrl> for block placement
  var blockPosPlace, blockPosErase
  var hl = game.highlighter = highlight(game, { color: 0xff0000 })
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
  hl.on('remove', function (voxelPos) { blockPosErase = null })
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })

  // toggle between first and third person modes
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()
      /*
    if (ev.keyCode === 'V'.charCodeAt(0) && (postprocessor.passes[1].uniforms.dreamvision.value < 1.0)) postprocessor.passes[1].uniforms.dreamvision.value += 0.05
    if (ev.keyCode === 'B'.charCodeAt(0) && (postprocessor.passes[1].uniforms.dreamvision.value > 0.0)) postprocessor.passes[1].uniforms.dreamvision.value -= 0.05
    
    if (ev.keyCode === 'N'.charCodeAt(0) && (postprocessor.passes[1].uniforms.bloodvision.value < 1.0)) postprocessor.passes[1].uniforms.bloodvision.value += 0.05
    if (ev.keyCode === 'M'.charCodeAt(0) && (postprocessor.passes[1].uniforms.bloodvision.value > 0.0)) postprocessor.passes[1].uniforms.bloodvision.value -= 0.05
    
    if (ev.keyCode === 'H'.charCodeAt(0) && (postprocessor.passes[1].uniforms.frostvision.value < 1.0)) postprocessor.passes[1].uniforms.frostvision.value += 0.05
    if (ev.keyCode === 'J'.charCodeAt(0) && (postprocessor.passes[1].uniforms.frostvision.value > 0.0)) postprocessor.passes[1].uniforms.frostvision.value -= 0.05
      */
    console.log(postprocessor.passes[1].uniforms.bloodvision.value)
  })

  // block interaction stuff, uses highlight data
  var currentMaterial = 1

  game.on('fire', function (target, state) {
    console.log("break");
    
    // var camera = game.camera;

    // var vector = new game.THREE.Vector3(0,0,0.5);
    // var projector = new game.THREE.Projector();
    // projector.unprojectVector(vector, camera);
    // console.log(JSON.stringify(vector));

    // var raycaster = new game.THREE.Raycaster(camera.position, vector.sub(camera.position).normalize(), 0, 100000);
    // //raycaster.ray.direction.set(vector.x, vector.y, vector.z)

    // creatureMeshes = [];
    // for (var c = 0; c < creatures.length; c++) {
    //   creatureMeshes.push(creatures[c].body);
    // }

    // var intersects = raycaster.intersectObjects(creatureMeshes, true);

    // if (intersects.length > 0) {
    //     console.log('intersect: ' + intersects[0].point.x.toFixed(2) + ', ' + intersects[0].point.y.toFixed(2) + ', ' + intersects[0].point.z.toFixed(2) + ')');
    // }
    // else {
    //     console.log('no intersect');
    // }
    // var position = blockPosPlace
    // if (position) {
    //   game.createBlock(position, currentMaterial)
    //   client.emitter.emit('set', position, currentMaterial)
    // } else {
    //   position = blockPosErase
    //   if (position) {
    //     game.setBlock(position, 0)
    //     console.log("Erasing point at " + JSON.stringify(position))
    //     client.emitter.emit('set', position, 0)
    //   }
    // }
  })
}