if(document.URL.search("localhost") == -1)
	require('./hello-world.js')({server: "ws://zurvival.herokuapp.com/"})
else
	require('./hello-world.js')({server: "ws://localhost:8080/"})