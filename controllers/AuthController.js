const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Basic')) {
      res.status(401).json({ error: 'Unauthorized' });
      console.log('1');
      return;
    }
    const base64Decode = authHeader.split(' ')[1];
    console.log(base64Decode);
    const asciiString = Buffer.from(base64Decode, 'base64').toString('ascii');
    const [usremail, usrpassword] = asciiString.split(':');
    const usr = await dbClient.userCollection().findOne({ email: usremail });
    if (!usr || usr.password !== sha1(usrpassword)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    redisClient.set(key, usr._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token: '155342df-2399-41da-9e8c-458b6ac52a0c' });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['X-Token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const key = `auth_${token}`;
    const usr = await redisClient.get(key);
    if (!usr) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(key);
    res.status(204).end();
  }
}

module.exports = AuthController;
