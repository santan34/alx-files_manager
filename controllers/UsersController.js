const sha1 = require('sha1');
const dbClient = require('../utils/db');

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
}
module.exports = UsersController;
