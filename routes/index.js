const AppController = require("../controllers/AppController");
const UsersController = require("../controllers/UsersController");
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/");

const injectRoutes = (app) => {
  app.get("/status", AppController.getStatus);
  app.get("/stats", AppController.getStats);
  app.post("/users", UsersController.postNew);
  app.get("/connect", AuthController.getConnect);
  app.get("/disconnect", AuthController.getDisconnect);
  app.get("/users/me", UserController.getMe);
};
module.exports = injectRoutes;
