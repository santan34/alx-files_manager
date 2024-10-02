const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class FilesController {
  static async postUpload(req, res) {
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
    const user = await dbClient.userCollection().findOne({ _id: usr });
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { name, type, isPublic, parentId, data } = req.body;
    if (!name) {
      res.status(400).json({ error: "Missing name" });
      return;
    }
    if (!type || ["folder", "file", "image"].includes(type === false)) {
      res.status(400).json({ error: "Missing type" });
      return;
    }
    if (!data && type !== folder) {
      res.status(400).json({ error: "Missing data" });
      return;
    }
    if (parentId) {
      const parent = await dbClient
        .filesCollection()
        .findOne({ _id: parentId });
      if (!parent) {
        res.status(400).json({ error: "Parent not found" });
        return;
      }
      if (parent.type !== "folder") {
        res.status(400).json({ error: "Parent is not a folder" });
        return;
      }
    }
    const fileDoc = {
      userId: user._id,
      name,
      type,
      isPublic,
      parentId,
    };
    if (type === "folder") {
      const result = await dbClient.filesCollection().insertOne(fileDoc);
      res.status(201).json(result.ops[0]);
      return;
    }
    const fdrpath = process.env.FOLDER_PATH || "/tmp/files_manager";
    if (!fs.existsSync(fdrpath)) {
      fs.mkdirSync(fdrpath, { recursive: true });
    }
    const mypath = path.join(fdrpath.uuidv4());
    fs.writeFileSync(mypath, Buffer.from(data, "base64"));
    fileDoc.localPath = mypath;
    const resl = await dbClient.FilesCollection().insertOne(fileDocument);
    res.status(201).json(resl.ops[0]);
  }
}

module.exports = FilesController;
