const WebSocket = require('ws');
const redis = require('redis');

// WebSocket Server
const wss = new WebSocket.Server({port: 4000});

// Redis Client
const subscriber = redis.createClient();

let clients = [];
//let client;

subscriber.subscribe('testPublish');

subscriber.on('message', (channel, message) => {
  console.log("Message: " + message);
  wss.clients.forEach(client => client.send());
  wss.clients.clear();
});

// const broadcast = (data, user) => {
//   const textToSend = JSON.stringify(data);
//   //clients[0].send('adsafa');
//   // for (let i = 0; i < clients.length; i++) {
//   //   if (clients[i] === user) {
//   //     clients[i].send(textToSend);
//   //   }
//   // }
// }

wss.on('connection', (ws) => {
  console.log('Client has connected');

  clients.push(ws);

  // ws.on('open', (user) => {
  //   // Contains userId
  //   console.log(user);
  //   client = JSON.parse(user);
  // })
  // ws.on('close', () => {
  //   console.log('Client has disconnected')
  // });

  ws.on('message', (rawData) => {
    console.log(rawData);
    //broadcast(rawData, client.userId);
  });
});
