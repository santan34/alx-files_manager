const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

const injectRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.post('/users', UsersController.postNew);
};
module.exports = injectRoutes;
