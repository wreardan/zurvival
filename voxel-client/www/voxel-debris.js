var funstance = require('funstance');
var EventEmitter = require('events').EventEmitter;

var resources = new Array();

function removeResource(uid, game) {
    found = 0;
    for (var c = 0; c < resources.length; c++) {
        if (resources[c].uid.equals(uid)) {
            found = 1;
            var item = resources.splice(c,1)[0].item;
            game.removeItem(item);
            game.scene.remove(item.mesh);
        }
    }
    if (!found) {
        alert('Tried to remove unknown item: '+JSON.stringify(uid));
    }
}

function addResource(item, game) {
    game.addItem(item);
    game.scene.add(item.mesh);
//    item.uid.equals = function(uid) {
//        return this.playerID == uid.playerID && this.index == uid.index;
//    }
//    resources.push({uid:item.uid, item:item});
}

module.exports = function (game, opts, client) {
    if (!opts) opts = {};
    if (!opts.limit) opts.limit = function () { return false };
    if (opts.yield === undefined) opts.yield = 4;
    if (typeof opts.yield !== 'function') {
        opts.yield = (function (y) {
            return function () { return y };
        })(opts.yield);
    }
    
    if (!opts.expire) opts.expire = {};
    if (typeof opts.expire === 'number') {
        opts.expire = { start : opts.expire, end : opts.expire };
    }
    if (!opts.expire.start) opts.expire.start = 15 * 1000;
    if (!opts.expire.end) opts.expire.end = 30 * 1000;
    if (!opts.power) opts.power = 1
    
    game.on('collision', function (item) {
        if (!item._debris) return;
        if (opts.limit && opts.limit(item)) return;
        
        client.emitter.emit('grabResource', item.uid);
        removeResource(item.uid, game);
        item._collected = true;
        em.emit('collect', item);
    });

    client.emitter.on('grabResource', function(uid) {
        removeResource(uid, game);
    });

    client.emitter.on('addResource', function(resource) {
        var item = createDebris(game, resource.pos, resource.value, resource.uid);
        item.velocity = resource.velocity;
        addResource(item, game);
        setTimeout(function (item) {
            removeResource(item.uid, game);
            if (!item._collected) em.emit('expire', item);
        }, resource.time, item);
    });
    
    var em = new EventEmitter;
    return funstance(em, function (pos) {
        var value = game.getBlock(pos);
        if (value === 0) return;
        game.setBlock(pos, 0);
        
        for (var i = 0; i < opts.yield(value); i++) {
            var item = createDebris(game, pos, value,
            {
                playerID: client.playerID,
                index: index++
            });
            item.velocity = {
                x: (Math.random() * 2 - 1) * 0.05 * opts.power,
                y: (Math.random() * 2 - 1) * 0.05 * opts.power,
                z: (Math.random() * 2 - 1) * 0.05 * opts.power
            };
            addResource(item, game);
            
            var time = opts.expire.start + Math.random()
                * (opts.expire.end - opts.expire.start);
            
            setTimeout(function (item) {
 //               removeResource(item.uid, game);
                if (!item._collected) em.emit('expire', item);
            }, time, item);

            client.emitter.emit('addResource',
            {
                time: time,
                pos: pos,
                velocity: item.velocity,
               // uid: item.uid,
                value: item.value
            })
        }
    });
}

var index = 0;
function createDebris (game, pos, value, uid) {
    var mesh = new game.THREE.Mesh(
        new game.THREE.CubeGeometry(4, 4, 4),
        game.material
    );
    mesh.geometry.faces.forEach(function (face) {
        face.materialIndex = value - 1
    });
    mesh.translateX(pos.x);
    mesh.translateY(pos.y);
    mesh.translateZ(pos.z);
    
    return {
        //uid: uid,
        mesh: mesh,
        size: 4,
        collisionRadius: 22,
        value: value,
        _debris: true,
        velocity: {
            x: (Math.random() * 2 - 1) * 0.05,
            y: (Math.random() * 2 - 1) * 0.05,
            z: (Math.random() * 2 - 1) * 0.05
        }
    };
}