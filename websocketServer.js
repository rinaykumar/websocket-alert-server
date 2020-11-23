const WebSocket = require('ws');
const redis = require('redis');

// WebSocket Server
const wss = new WebSocket.Server({ port: 4000 });

// Redis Client
const subscriber = redis.createClient();

let clients = [];

subscriber.subscribe('testPublish');

subscriber.on('message', (channel, message) => {
  console.log('Message: ' + message);
  // Testing send call here with a send to all clients
  // Without sending here, test fails at line 60
  wss.clients.forEach((client) => client.send(message));
  wss.clients.clear();
});

// Trying to send to just one client
const broadcast = (data, user) => {
  const textToSend = JSON.stringify(data);
  for (let i = 0; i < clients.length; i++) {
    if (clients[i] === user) {
      clients[i].send(textToSend);
    }
  }
}

wss.on('connection', (ws) => {
  console.log('Client has connected');

  clients.push(ws);

  /* This grabs their userid of the client, however if there are more than
     one 'ws.on' methods the test fails */

  // ws.on('open', (user) => {
  //   // Contains userId
  //   console.log(user);
  //   client = JSON.parse(user);
  // })

  ws.on('message', (rawData) => {
    console.log(rawData);
    broadcast(rawData, client.userId);
  });
});
