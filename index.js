var http = require('http')
var ecstatic = require('ecstatic')
var WebSocketServer = require('ws').Server
var websocket = require('websocket-stream')
var duplexEmitter = require('duplex-emitter')
var path = require('path')
var uuid = require('hat')
var crunch = require('voxel-crunch')
var engine = require('voxel-engine')
var texturePath = require('painterly-textures')(__dirname)
var voxel = require('voxel')
var Player = require('./player.js')
var Creature = require('./creature.js')

module.exports = function() {

  function flatGenerator(x,y,z) {
    return y <= 1 ? 1 : 0;
  }

  // these settings will be used to create an in-memory
  // world on the server and will be sent to all
  // new clients when they connect
  var settings = {
  	generate: voxel.generator['Hilly Terrain'],
    //generate: flatGenerator,
  	chunkDistance: 3,
    chunkSize: 32,
  	materials: [
  	['grass', 'dirt', 'grass_dirt'],
  	'obsidian',
  	'brick',
  	'grass'
  	],
  	texturePath: texturePath,
  	worldOrigin: [0, 0, 0],
  	controls: { discreteFire: true },
    avatarInitialPosition: [2, 30, 2],
    controlOptions: {jump: 6},
    controls: {
      speed: 0.0032,
      jumpSpeed: 0.00016,
    }
  }
  
  var game = engine(settings)
  var server = http.createServer(ecstatic(path.join(__dirname, 'voxel-client/www')))
  var wss = new WebSocketServer({server: server})
  var clients = {}
  var creatures = []
  var chunkCache = {}
  var usingClientSettings

  //initialize creature module
  var creature = new Creature(game)
  creature.position.x = 5
  creature.position.y = 30
  creature.position.z = 5

  creatures.push(creature)

  // simple version of socket.io's sockets.emit
  function broadcast(id, cmd, arg1, arg2, arg3) {
    Object.keys(clients).map(function(client) {
      if (client === id) return
      clients[client].emit(cmd, arg1, arg2, arg3)
    })
  }

  function sendUpdate() {
    var clientKeys = Object.keys(clients)
    if (clientKeys.length === 0) return

    //players
    var update = {positions:{}, date: +new Date()}
    clientKeys.map(function(key) {
      var emitter = clients[key]
      emitter.player.player.update()
      update.positions[key] = {
        position: emitter.player.position,
        rotation: {
          x: emitter.player.rotation.x,
          y: emitter.player.rotation.y
        },
        playerBundle: emitter.player.player.makeResourceBundle()
      }
      creatures[0].face(emitter.player)
    })

    //creatures
    update.creatures = []
    for(var i = 0; i < creatures.length; i++){
      creatures[i].update()
      update.creatures[i] = creatures[i].makeBundle()
    }
    //send out to all clients
    broadcast(false, 'update', update)
  }

  setInterval(sendUpdate, 1000/22) // 45ms

  wss.on('connection', function(ws) {
    // turn 'raw' websocket into a stream
    var stream = websocket(ws)

    var emitter = duplexEmitter(stream)
	
    emitter.on('clientSettings', function(clientSettings) {
		// Enables a client to reset the settings to enable loading new clientSettings
		if (clientSettings != null) {
			if (clientSettings.resetSettings != null) {
				console.log("resetSettings:true")
				usingClientSettings = null
				if (game != null) game.destroy()
				game = null
				chunkCache = {}
			}
		}
		
	  if (clientSettings != null && usingClientSettings == null) {
		  usingClientSettings = true
		  // Use the correct path for textures url
	      clientSettings.texturePath = texturePath
		  //deserialise the voxel.generator function.
		  if (clientSettings.generatorToString != null) {
			  clientSettings.generate = eval("(" + clientSettings.generatorToString + ")")
		  }
		  settings = clientSettings
	      console.log("Using settings from client to create game.")
		  game = engine(settings)
	  } else {
		  if (usingClientSettings != null) {
		  	console.log("Sending current settings to new client.")
		  } else {
		  	console.log("Sending default settings to new client.")
		  }
	  }
    })

    var id = uuid()
    clients[id] = emitter

    emitter.player = {
      rotation: new game.THREE.Vector3(),
      position: new game.THREE.Vector3(),
      player: new Player()
    }

    //creature.notice(emitter.player, { radius: 500 });

    console.log(id, 'joined')
    emitter.emit('id', id)
    broadcast(id, 'join', id)
    stream.once('end', leave)
    stream.once('error', leave)
    function leave() {
      delete clients[id]
      console.log(id, 'left')
      broadcast(id, 'leave', id)
    }

    emitter.on('message', function(message) {
      if (!message.text) return
      if (message.text.length > 140) message.text = message.text.substr(0, 140)
      if (message.text.length === 0) return
      console.log('chat', message)
      broadcast(null, 'message', message)
    })

    // give the user the initial game settings
	if (settings.generate != null) {
	  	settings.generatorToString = settings.generate.toString()
	}
    emitter.emit('settings', settings)

    // fires when the user tells us they are
    // ready for chunks to be sent
    emitter.on('created', function() {
      sendInitialChunks(emitter)
      //stuff to send at start

      // fires when client sends us new input state, fires every tick
      emitter.on('state', function(state) {
        //stuff to send every tick
        emitter.player.rotation.x = state.rotation.x
        emitter.player.rotation.y = state.rotation.y

        if(state.sleep) {
          emitter.player.sleep = 100
        }

        var pos = emitter.player.position
        var distance = pos.distanceTo(state.position)
        if (distance > 20) {
          var before = pos.clone()
          pos.lerp(state.position, 0.1)
          return
        }
        pos.copy(state.position)
      })
    })

    emitter.on('set', function(pos, val) {
      game.setBlock(pos, val)
      var chunkPos = game.voxels.chunkAtPosition(pos)
      var chunkID = chunkPos.join('|')
      if (chunkCache[chunkID]) delete chunkCache[chunkID]
      broadcast(null, 'set', pos, val)
    })

  })

  function sendInitialChunks(emitter) {
    Object.keys(game.voxels.chunks).map(function(chunkID) {
      var chunk = game.voxels.chunks[chunkID]
      var encoded = chunkCache[chunkID]
      if (!encoded) {
        encoded = crunch.encode(chunk.voxels)
        chunkCache[chunkID] = encoded
      }
      emitter.emit('chunk', encoded, {
        position: chunk.position,
        dims: chunk.dims,
        length: chunk.voxels.length
      })
    })
    emitter.emit('noMoreChunks', true)
  }
  
  return server
}