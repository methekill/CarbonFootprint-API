// eslint-disable-next-line import/no-extraneous-dependencies
require('module-alias/register');

// To run this script use "node electricity_db_td.js"
// database setup
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// get the logger
// eslint-disable-next-line import/no-unresolved
const Logger = require('@framework/Logger');
// get the database configuration file
// eslint-disable-next-line import/no-unresolved
const config = require('@root/config.json');

try {
  if (!config) {
    throw new Error('config.json missing');
  }
} catch (e) {
  Logger.error('Database configuration file "config.json" is missing.');
  process.exit(1);
}
const db = config.database;

// connect to the database
mongoose.connect(`mongodb+srv://${db.username}:${db.password}@${db.hostname}/${db.dbname}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// When successfully connected
mongoose.connection.on('connected', () => {
  Logger.info('Connection to database established successfully');
  Logger.info('electricity_db.js running');
});

// If the connection throws an error
mongoose.connection.on('error', err => {
  Logger.error(`Error connecting to database: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  Logger.info('Database disconnected');
});
// eslint-disable-next-line import/no-unresolved
const json = require('@raw_data/electricity_emission.json');
const Emission = require('../../models/emissionModel.js');

const emissions = [];
for (let js = 0; js < json.length; js++) {
  const obj = new Emission();
  obj.item = 'electricity';
  obj.region = json[js].Country;
  obj.quantity = [1];
  obj.unit = 'kWh';
  obj.categories = ['electricity'];
  obj.components = [
    {
      name: 'generation',
      quantity: [1],
      unit: 'kWh',
    },
    {
      name: 'td',
      quantity: [1],
      unit: 'kWh',
    },
  ];
  emissions.push(obj);
}

Emission.create(emissions, err => {
  if (err) throw err;
  mongoose.connection.close();
});
