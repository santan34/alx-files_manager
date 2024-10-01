const dbClient = require('../utils/db');
const sha1 = require('sha1')

class UsersController{
    static async postNew(req, res){
        const email =  req.body.email || req.body || null;
        const password =req.body.password || req.body || null;
        if(!email) {
            res.status(400).json({error: 'Missing email'});
            return
        }
        if (!password) {
            res.status(400).json({error: 'Missing password'})
            return
        }
        const user = await dbClient.userCollection.findOne({ email });
        if (user) {
            res.status(400).json({error: 'Already exist'});
            return
        }
        if (!user) {
           const inserted = await dbClient.userCollection.insertOne({ email, password: sha1(password) });
           const userid  = inserted.insertedId.tostring();
           res.status(201).json({ email, id: userid });
        }

    }
}