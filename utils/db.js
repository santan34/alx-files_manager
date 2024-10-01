import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(uri);
    this.client.connect();
  }

  isAlive() {
    if (this.client.topology && this.client.topology.isConnected()) {
      return true;
    }
    return false;
  }

  async nbUsers() {
    const users = await this.client.db().collection('users').countDocuments();
    return users;
  }

  async nbFiles() {
    const files = await this.client.db().collection('files').countDocuments();
    return files;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
