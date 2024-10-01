const AppController = require('../controllers/AppController');

const injectRoutes = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
};
module.exports = injectRoutes;
