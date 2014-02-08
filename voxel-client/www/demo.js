if(document.URL.search("localhost") == -1)
	require('./hello-world.js')({server: "ws://test.worldwebcraft.com/"})
else
	require('./hello-world.js')({server: "ws://localhost:80/"})