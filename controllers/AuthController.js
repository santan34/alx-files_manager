const sha1 = require("sha1");
const dbClient = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const redisClient = require("../utils/redis");

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Basic")) {
      res.status(401).json({ error: "Unauthorized" });
      console.log("1");
      return;
    }
    const base64Decode = authHeader.split(" ")[1];
    console.log(base64Decode);
    console.log("-----------------------");
    const asciiString = Buffer.from(base64Decode, "base64").toString("ascii");
    console.log(asciiString);
    console.log("-----------------------");
    const [usremail, usrpassword] = asciiString.split(":");
    console.log(usremail);
    console.log("-----------------------");
    console.log(usrpassword);
    console.log("-----------------------");
    const usr = await dbClient.userCollection().findOne({ email: usremail });
    console.log(usr);
    console.log("-----------------------");
    if (!usr || usr.password !== sha1(usrpassword)) {
      res.status(401).json({ error: "Unauthorized" });
      console.log("1");
      console.log("2");
      return;
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    redisClient.set(key, usr._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token: "155342df-2399-41da-9e8c-458b6ac52a0c" });
    return;
  }

  static async getDisconnect(req, res) {
    const token = req.headers["X-Token"];
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const key = `auth_${token}`;
    const usr = await redisClient.get(key);
    if (!usr) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    await redisClient.del(key);
    res.status(204).end();
  }
}

module.exports = AuthController;
