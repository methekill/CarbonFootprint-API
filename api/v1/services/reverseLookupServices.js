/* eslint-disable no-loop-func */
// eslint-disable-next-line import/no-unresolved
const Logger = require('@framework/Logger');
const Emission = require('../../models/emissionModel');
// get the helper functions
const Helper = require('../controllers/helperFunctions');

const getTreesReverseLookup = emissions =>
  new Promise((resolve, reject) => {
    const treeMatch = {
      section: 'trees',
      item: '',
      quantity: 0,
      unit: '',
    };
    Emission.aggregate(
      [
        {
          $match: {
            'categories.0': 'trees',
          },
        },
        {
          $sample: {
            size: 1,
          },
        },
      ],
      (err, match) => {
        if (!err && match) {
          let matchedQuantity = match[0].components[0].quantity;
          if (matchedQuantity < 0) {
            matchedQuantity *= -1;
          }
          const targetQuantity = emissions.CO2 / matchedQuantity;
          treeMatch.item = match[0].item;
          treeMatch.unit = match[0].unit;
          treeMatch.quantity = targetQuantity;
          if (match[0].region && match[0].region !== 'Default') {
            treeMatch.region = match[0].region;
          }
          resolve(treeMatch);
        } else {
          Logger.error(`Cannot find tree :${err}`);
          reject(err);
        }
      },
    );
  });

const getVehiclesReverseLookup = (emissions, relativeLocation) =>
  new Promise((resolve, reject) => {
    const vehicleMatch = {
      section: 'vehicles',
      source: '',
      sourceState: '',
      destination: '',
      destinationState: '',
      mileage: 0,
      distance: 0,
    };
    const vehicleDefault = 2.328; // petrol default.
    const geoDetails = Helper.geodecodeFromLatLon(relativeLocation.lat, relativeLocation.lng);
    geoDetails
      .then(val => {
        const countryCityDataPath = `../../../raw_data/cities/${val.countryCode}.json`;
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const cityList = require(countryCityDataPath);
        const noOfCities = Object.keys(cityList).length;
        do {
          const destinationCity = cityList[Helper.getRandomNumber(0, noOfCities)];
          const distance = Helper.getDistanceFromLatLon(
            relativeLocation.lat,
            relativeLocation.lng,
            destinationCity.lat,
            destinationCity.lng,
          );
          const noOfLitres = emissions.CO2 / vehicleDefault;
          const newMileage = distance / noOfLitres;
          if (destinationCity.name !== val.city && (newMileage > 10 && newMileage < 30)) {
            const geoDetailsDest = Helper.geodecodeFromLatLon(
              destinationCity.lat,
              destinationCity.lng,
            );
            geoDetailsDest
              .then(details => {
                const destinationState = details.state;
                vehicleMatch.source = val.city;
                vehicleMatch.sourceState = val.state;
                vehicleMatch.destination = destinationCity.name;
                vehicleMatch.destinationState = destinationState;
                vehicleMatch.mileage = newMileage;
                vehicleMatch.distance = distance;
                resolve(vehicleMatch);
              })
              .catch(() => {
                vehicleMatch.source = val.city;
                vehicleMatch.sourceState = val.state;
                vehicleMatch.destination = destinationCity.name;
                vehicleMatch.mileage = newMileage;
                vehicleMatch.distance = distance;
                resolve(vehicleMatch);
              });
            break;
          }
          // eslint-disable-next-line no-constant-condition
        } while (true);
      })
      .catch(err => {
        Logger.error(`Cannot find vehicle :${err}`);
        reject(err);
      });
  });

const getTrainReverseLookup = (emissions, relativeLocation) =>
  new Promise((resolve, reject) => {
    const trainMatch = {
      section: 'trains',
      source: '',
      destination: '',
      passengers: 0,
      distance: 0,
    };
    const results = Helper.nearbyTrainStations(relativeLocation);
    results
      .then(val => {
        const sourceName = val[0].name;
        const sourceLocation = val[0].location;
        // We currently use the railcar type by default since it's the type that is most
        // relatable. Hardcoding this for now since obtaining this from the DB is pretty
        // expensive for this already expensive operation.
        const railcarDefault = 0.0412;
        const matches = [];
        for (let i = 0; i < val.length; i++) {
          const destinationLocation = val[i].location;
          const destinationName = val[i].name;
          const interDistance = Helper.getDistanceFromLatLon(
            sourceLocation.lat,
            sourceLocation.lng,
            destinationLocation.lat,
            destinationLocation.lng,
          );
          const noOfPassengers = Math.round(emissions.CO2 / (railcarDefault * interDistance));
          const singleMatch = {
            source: sourceName,
            destination: destinationName,
            distance: interDistance,
            passengers: noOfPassengers,
            location: destinationLocation,
          };
          matches.push(singleMatch);
        }

        if (matches.length > 1) {
          const chosenOne = Helper.getRandomNumber(1, matches.length - 1);
          const trainSourceLocation = sourceLocation;
          const trainDestLocation = matches[chosenOne].location;
          const railDistance = Helper.railDistanceInCoordinates(
            trainSourceLocation,
            trainDestLocation,
          );
          railDistance
            .then(val2 => {
              const newPassengerCount = Math.round(emissions.CO2 / (railcarDefault * val2));
              trainMatch.source = sourceName;
              trainMatch.destination = matches[chosenOne].destination;
              trainMatch.passengers = newPassengerCount;
              trainMatch.distance = val2;
              resolve(trainMatch);
            })
            .catch(err => {
              Logger.error(`Failed to get rail distance: ${err}`);
              reject(new Error(`Failed to get rail distance: ${err}`));
            });
        } else {
          reject(new Error('Not many stations around the given location'));
        }
      })
      .catch(err => {
        reject(err);
      });
  });

const findMatch = (emissions, section, relativeLocation) => {
  const supportedSections = {
    section1: 'trees',
    section2: 'trains',
    section3: 'vehicles',
    section4: 'all',
  };
  return new Promise((resolve, reject) => {
    // We are only concerned with CO2 emission for now
    if (Object.values(supportedSections).includes(section) && emissions.CO2) {
      if (section === 'trains') {
        const trainResponse = {
          train: '',
          section: 'trains',
        };
        getTrainReverseLookup(emissions, relativeLocation)
          .then(result => {
            delete result.section;
            trainResponse.match = result;
            resolve(trainResponse);
          })
          .catch(err => {
            reject(err);
          });
      } else if (section === 'vehicles') {
        const vehicleResponse = {
          match: '',
          section: 'vehicles',
        };
        getVehiclesReverseLookup(emissions, relativeLocation)
          .then(result => {
            delete result.section;
            vehicleResponse.match = result;
            resolve(vehicleResponse);
          })
          .catch(err => {
            reject(err);
          });
      } else if (section === 'trees') {
        const treeResponse = {
          match: '',
          section: 'trees',
        };
        getTreesReverseLookup(emissions)
          .then(result => {
            delete result.section;
            treeResponse.match = result;
            resolve(treeResponse);
          })
          .catch(err => {
            reject(err);
          });
      } else if (section === 'all') {
        const sectionPromises = [];
        const reflect = p =>
          p.then(
            match => ({
              status: 'success',
              match,
              section: match.section,
            }),
            error => ({
              error: error.message,
              status: 'failure',
            }),
          );
        sectionPromises.push(getTrainReverseLookup(emissions, relativeLocation));
        sectionPromises.push(getVehiclesReverseLookup(emissions, relativeLocation));
        sectionPromises.push(getTreesReverseLookup(emissions));
        Promise.all(sectionPromises.map(reflect))
          .then(results => {
            for (let i = 0; i < results.length; i++) {
              if (results[i].match) {
                // Cleanup unwanted section key
                delete results[i].match.section;
              }
            }
            resolve(results);
          })
          .catch(err => {
            reject(err);
          });
      }
    } else reject(new Error('invalid category'));
  });
};

exports.reverseFind = async (emissions, section, relativeLocation) => {
  const matches = await findMatch(emissions, section, relativeLocation);
  return matches;
};
