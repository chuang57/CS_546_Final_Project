const MongoClient = require('mongodb').MongoClient;

const settings = {
  mongoConfig: {      
    "serverUrl": "mongodb+srv://chuang:546stevens19@apartment-finder.7mnia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    //"serverUrl": 'mongodb://localhost:27017/',
    "database": 'Apartment-Finder'

    // serverUrl: 'mongodb://localhost:27017/',
    // database: 'Apartment-Finder'
  }
};
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = {
  connectToDb: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = await _connection.db(mongoConfig.database);
    }
        
    return _db;
  },
  closeConnection: () => {
    _connection.close();
  }
};