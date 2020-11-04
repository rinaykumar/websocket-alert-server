# HW3 

Create a scaleable websocket alert server with subscribe notifications.

## api server
Create an api server with a single post endpoint `/api/doSomething?userId=abc&text=hello` where `userId` is the id of a user to send a message to, and `text` is the text to send.
When the message is recieved, the api server should publish to the redis client on the `testPublish` channel.

## Websocket server
The Websocket server should subscribe to the same channel. On broadcast it should send to all clients with the same `userId`. When a client connects, it will send a message with the form `{userid: userId}`. Store the `ws` object so that when a broadcast is called, it only sends it to connections with that userid.
