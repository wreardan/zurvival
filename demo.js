var server = require('./')()
var port = process.env.PORT || 8080
server.listen(port)
console.log('Listening on ', port, ' open http://localhost:', port)