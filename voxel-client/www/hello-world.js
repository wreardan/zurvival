var createClient = require('../')
var highlight = require('voxel-highlight')
var extend = require('extend')
var voxelPlayer = require('voxel-player')
var voxelpp = require('voxel-pp')

var postprocessor

var game
var createCreature

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
          dreamvision: {type: 'f', value: 0.5},
          bloodvision: {type: 'f', value: 0.4}}})
    }
    shaderRequest.open("GET", "./postproc.fs")
    shaderRequest.send()

//initialize creature creation module
    createCreature = require('voxel-creature')(game)

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
    if (ev.keyCode === 'B'.charCodeAt(0)) postprocessor.passes[1].uniforms.dreamvision.value += 0.1
    if (ev.keyCode === 'V'.charCodeAt(0)) postprocessor.passes[1].uniforms.dreamvision.value -= 0.1
        
  })

  // block interaction stuff, uses highlight data
  var currentMaterial = 1

  game.on('fire', function (target, state) {
    var position = blockPosPlace
    if (position) {
      game.createBlock(position, currentMaterial)
      client.emitter.emit('set', position, currentMaterial)
    } else {
      position = blockPosErase
      if (position) {
        game.setBlock(position, 0)
        console.log("Erasing point at " + JSON.stringify(position))
        client.emitter.emit('set', position, 0)
      }
    }
  })
}