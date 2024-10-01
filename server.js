import { express } from 'express';

const injectRoutes = require('./routes/index');

const server = express();
const port = process.env.EXPRESS_PORT || 5000;

injectRoutes(server);
server.listen(port, () => {
  console.log(`server started on port ${port}`);
});

module.exports = server;
