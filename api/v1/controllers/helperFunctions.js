const NodeGeocoder = require('node-geocoder');
const axios = require('axios');
// eslint-disable-next-line import/no-unresolved
const countryToCode = require('@root/raw_data/countryToCode.json');

var options = {
  provider: "virtualearth",
  apiKey: process.env.MICROSOFT_MAPS_KEY,
  formatter: null
};

const createMapURI = opt =>
  `https://dev.virtualearth.net/REST/v1/${opt}?key=${
    process.env.MICROSOFT_MAPS_KEY
  }`;

const getDistanceFromLatLon = (lat1, lon1, lat2, lon2) => {
  let p = 0.017453292519943295; // Math.PI / 180
  let c = Math.cos;
  let a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

const getRandomNumber = (minimum, maximum) => {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

//Using Microsoft map api to find distance.
const distance = (ori, dest, mod) => {
  return new Promise(async (resolve, reject) => {
    var geocoder = NodeGeocoder(options);
    let oriCoord, destCoord;
    try {
      const resOrigin = await geocoder.geocode(ori);
      oriCoord = {
        latitude: resOrigin[0].latitude,
        longitude: resOrigin[0].longitude
      };
      const resDest = await geocoder.geocode(dest);
      destCoord = {
        latitude: resDest[0].latitude,
        longitude: resDest[0].longitude
      };
    } catch (err) {
      console.log(err);
      reject("Unable to locate your position");
    }
    axios
      .post(createMapURI("Routes/DistanceMatrix"), {
        origins: [oriCoord],
        destinations: [destCoord],
        travelMode: "driving"
      })
      .then(data => {
        if (
          data.data.resourceSets[0].resources[0].results[0].travelDistance === 0
        )
          reject("Distance data not available");
        else
          resolve(
            data.data.resourceSets[0].resources[0].results[0].travelDistance
          );
      })
      .catch(err =>
        reject(
          "Unable to find the distance between the origin and destination points."
        )
      );
  });
}

const nearbyTrainStations = async relativeLocation => {
  // TODO bug fix
  const trainStationData = await geodecodeFromLatLon(relativeLocation.lat, relativeLocation.lng);
  const { city } = trainStationData;
  const locationName = `${city}`;

  return new Promise((resolve, reject) => {
    axios
      .get(createMapURI(`Locations/${locationName}+Train+Railway+Station`), {})
      .then(data => {
        if (data.data.resourceSets[0].estimatedTotal === 0) {
          reject(new Error("Can't find any train station data"));
        } else {
          const dataArray = data.data.resourceSets[0].resources.reduce((accumulator, current) => {
            accumulator.push({
              name: current.name,
              location: {
                lat: current.geocodePoints[0].coordinates[0],
                lng: current.geocodePoints[0].coordinates[1],
              },
            });
            return accumulator;
          }, []);
          resolve(dataArray);
        }
      })
      .catch(err => reject("Unable to find nearby train stations"));
  });
};

// Different from distance(orig, dest, mod) since this accepts coordinates
const transitDistanceInCoordinates = (
  sourceLocation,
  destinationLocation,
  mode
) => {
  return new Promise((resolve, reject) => {
    axios
      .post(createMapURI("Routes/DistanceMatrix"), {
        origins: [
          { latitude: sourceLocation.lat, longitude: sourceLocation.lng }
        ],
        destinations: [
          {
            latitude: destinationLocation.lat,
            longitude: destinationLocation.lng
          }
        ],
        travelMode: "transit"
      })
      .then(data => {
        if (
          data.data.resourceSets[0].resources[0].results[0].travelDistance ===
            0 ||
          data.data.resourceSets[0].resources[0].results[0].travelDistance ===
            -1
        )
          reject("Distance data not available");
        else
          resolve(
            data.data.resourceSets[0].resources[0].results[0].travelDistance
          );
      })
      .catch(err =>
        reject(
          "Unable to find the distance between the origin and destination points."
        )
      );
  });
};

// Different from distance(orig, dest, mod) since this accepts coordinates
const railDistanceInCoordinates = (
  sourceLocation,
  destinationLocation,
  mode
) => {
  return new Promise((resolve, reject) => {
    axios
      .post(createMapURI("Routes/DistanceMatrix"), {
        origins: [
          { latitude: sourceLocation.lat, longitude: sourceLocation.lng }
        ],
        destinations: [
          {
            latitude: destinationLocation.lat,
            longitude: destinationLocation.lng,
          },
        ],
        travelMode: 'driving',
      })
      .then(data => {
        if (
          data.data.resourceSets[0].resources[0].results[0].travelDistance ===
            0 ||
          data.data.resourceSets[0].resources[0].results[0].travelDistance ===
            -1
        )
          reject("Distance data not available");
        else
          resolve(
            data.data.resourceSets[0].resources[0].results[0].travelDistance
          );
      })
      .catch(err => {
        reject(new Error('Unable to find the distance between the origin and destination points.'));
      });
  });
};

const geodecodeFromLatLon = (lat, lng) => {
  return new Promise((resolve, reject) => {
    var geocoder = NodeGeocoder(options);
    let data = {};
    geocoder.reverse(
      {
        lat: lat,
        lon: lng
      },
      function(err, res) {
        if (err) reject(err);
        else {
          //console.log(res);
          data.country = res[0].country;
          data.countryCode = countryToCode[res[0].country];
          data.city = res[0].city;
          data.state = res[0].state;
          // console.log(data);
          resolve(data);
        }
      }
    );
  });
};

module.exports = {
  geodecodeFromLatLon,
  railDistanceInCoordinates,
  transitDistanceInCoordinates,
  nearbyTrainStations,
  distance,
  getRandomNumber,
  getDistanceFromLatLon
};
