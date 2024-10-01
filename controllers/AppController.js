const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AppController {
  static getStatus(req, res) {
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static getStats(req, res) {
    res.status(200).json({
      users: dbClient.nbUsers,
      files: dbClient.nbFiles,
    });
  }
}

module.exports = AppController;
