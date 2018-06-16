//run node trains_db.js to add data to db.
// database setup
const mongoose = require('mongoose');
// get the database configuration file
const config = require('../../../config.json');
try {
  config
} catch (e) {
  console.log(`Database configuration file "config.json" is missing.`);
  process.exit(1);
}
const db = config.database;

// connect to the database
mongoose.connect(`mongodb://${db.username}:${db.password}@${db.hostname}:${db.port}/${db.dbname}`, { useMongoClient: true });

// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('Connection to database established successfully');
  console.log("trains_db.js running");
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to database: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected');
});

let Emission = require('../models/emissionModel.js');

let obj = new Emission();
let trainsData = require("../../../raw_data/trains.json");

for(items in trainsData){
    let obj = new Emission();
    obj.item = items;
    obj.region = trainsData[items]['region'];
    obj.quantity = trainsData[items]['quantity'];
    obj.unit = 'km';
    obj.categories = ["trains",trainsData[items]['category']];
    obj.components = [
        {
            name:'CO2',
            quantity :[trainsData[items]['C02']],
            unit : trainsData[items]['unit']
        },
        {
            name:'NO2',
            quantity:[trainsData[items]['NO2']],
            unit:trainsData[items]['unit']
        },
        {
            name:'CH4',
            quantity:[trainsData[items]['CH4']],
            unit:trainsData[items]['unit']
        }
    ];
    save(obj,items);
}

async function save(obj,items){
    await obj.save((err)=>{
        if(err) console.error(err);
        else console.log("Object for item "+items + " saved successfully");

    });
    // console.log(obj);
}
mongoose.connection.close();
