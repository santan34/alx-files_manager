import express from 'express';

const injectRoutes = require('./routes/index');

const server = express();
const port = process.env.EXPRESS_PORT || 5000;

server.use(express.json());
injectRoutes(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server;
