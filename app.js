const express = require('express');
const app = express();
const port = 3000;
const server = require('http').createServer(app);
const cors = require('cors');
// const io = require('socket.io')(server);
const osc = require("osc");

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3333',
    methods:['GET','POST']
  }
})

app.use(cors());
app.use('/', express.static('public'));

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

io.on('connection', client => {
  console.log(client.id)
  client.on('event', data => { });
  client.on('disconnect', () => { });
});

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 12345,
  metadata: true
});

udpPort.on("message", function (oscMsg, timeTag, info) {
  io.emit("osc", oscMsg);
});

udpPort.open();
