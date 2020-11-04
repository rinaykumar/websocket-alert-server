const express = require('express');
const app = express();


// http://localhost:4000/api/doSomething?userId=abc&text=hello

module.exports = app;

if (require.main === module) {
  console.log('Starting app');
  app.listen(4000);
}
