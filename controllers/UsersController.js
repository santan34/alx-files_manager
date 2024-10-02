const sha1 = require('sha1');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const user = await dbClient.userCollection().findOne({ email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    if (!user) {
      const inserted = await dbClient.userCollection().insertOne({
        email,
        password: sha1(password),
      });
      const userid = inserted.insertedId.tostring();
      res.status(201).json({ email, id: userid });
    }
  }

  static async getMe(req, res) {
    const token = req.headers['X-Token'];
    if (!token){
      res.status(401).json({error : 'Unauthorized'});
      return;
    }
    const key = `auth_${token}`;
    const usr = await redisClient.get(key);
    if (!usr) {
      res.status(401).json({error : 'Unauthorized'});
      return;
    }
    const user = await dbClient.userCollection().findOne({ _id: usr });
    if (!user) {
      res.status(401).json({error : 'Unauthorized'});
      return;
    }
    res.status(200).json({id:user._id, email:user.email}).end()
    return user;
  }
}
module.exports = UsersController;
