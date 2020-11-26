const WebSocket = require('ws');
const redis = require('redis');

// WebSocket Server
const wss = new WebSocket.Server({ port: 4000 });

// Redis Client
const subscriber = redis.createClient();

// To store clients
let clients = [];

// Subcribe to redis channel
subscriber.subscribe('testPublish');

// Get message from redis channel and send to broadcast function
subscriber.on('message', (channel, message) => {
  console.log('Message: ' + message);
  const textToSend = JSON.parse(message);
  broadcast(textToSend, textToSend.userId);
});

// Broadcast message from redis channel to specific client
const broadcast = (textToSend, userToSend) => {
  wss.clients.forEach((client) => {
    if (client == clients[userToSend]) {
      client.send(textToSend);
    }
  });
};

// Websocket server connection 
wss.on('connection', (ws) => {
  console.log('Client has connected');

  // Get message and store userId of client in clients array
  ws.on('message', (rawData) => {
    console.log(rawData);
    const data = JSON.parse(rawData);
    clients[data.userId] = ws;
  });
});
