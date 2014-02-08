var createClient = require('../')
var highlight = require('voxel-highlight')
var extend = require('extend')
var voxelPlayer = require('voxel-player')
var voxelpp = require('voxel-pp')
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
  var postprocessor = voxelpp(game)
  postprocessor.use([
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "void main() {",
    "/*",
    "dream vision vUvt effect",
    "http://www.geeks3d.com/20091112/shader-library-dream-vision-vUvt-processing-filter-glsl/",
    "*/",

        "vec4 texColor = texture2D(tDiffuse, vUv);",

        "texColor += texture2D(tDiffuse, vUv + 0.001);",
        "texColor += texture2D(tDiffuse, vUv + 0.003);",
        "texColor += texture2D(tDiffuse, vUv + 0.005);",
        "texColor += texture2D(tDiffuse, vUv + 0.007);",
        "texColor += texture2D(tDiffuse, vUv + 0.009);",
        "texColor += texture2D(tDiffuse, vUv + 0.011);",

        "texColor += texture2D(tDiffuse, vUv - 0.001);",
        "texColor += texture2D(tDiffuse, vUv - 0.003);",
        "texColor += texture2D(tDiffuse, vUv - 0.005);",
        "texColor += texture2D(tDiffuse, vUv - 0.007);",
        "texColor += texture2D(tDiffuse, vUv - 0.009);",
        "texColor += texture2D(tDiffuse, vUv - 0.011);",

        "texColor.rgb = vec3((texColor.r + texColor.g + texColor.b) / 3.0);",
        "texColor = texColor / 9.5;",

        "gl_FragColor = texColor;",
    "}"
    ].join("\n"))

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