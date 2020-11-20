const express = require('express');
const redis = require('redis');
const app = express();

const publisher = redis.createClient();

// http://localhost:4000/api/doSomething?userId=abc&text=hello
app.get('/api/doSomething', (req, res) => {
  let id = req.query.userId;
  let msg = req.query.text;

  let data = {userId: id, text: msg};

  publisher.publish('testPublish', JSON.stringify(data))

  res.end();
});

module.exports = app;

if (require.main === module) {
  console.log('Starting app');
  app.listen(4000);
}
