// eslint-disable-next-line import/no-unresolved
const redis = require('@framework/redis');
const axios = require('axios');

const { redisClient } = redis;
const reqbody = {
  startTimeMillis: new Date().setHours(0, 0, 0, 0) - 86400000 * 7,
  endTimeMillis: new Date().setHours(0, 0, 0, 0),
  bucketByTime: { durationMillis: 86400000 },
  aggregateBy: [
    {
      dataTypeName: 'com.google.step_count.delta',
      dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
    },
    {
      dataTypeName: 'com.google.distance.delta',
      dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:pruned_distance',
    },
  ],
};

exports.getApiToken = () => new Promise((resolve, reject) => {
  axios.post('https://dev-wtwvqlr1.auth0.com/oauth/token', {
    client_id: 'tjP1NumeTKov7rBIt6RKLNQ6Y9gUmsux', client_secret: 'PRovdXfrwt_LhvZNlIyesA4Uyxy9xgbtqESfzZ1DX6__kGoK10Xbw5BcfxCMd5UZ', audience: 'https://dev-wtwvqlr1.auth0.com/api/v2/', grant_type: 'client_credentials',
  }, {
    headers: { 'content-type': 'application/json' },
  }).then(managementAccessToken => {
    resolve(managementAccessToken.data.access_token);
  }).catch(error => {
    reject(new Error(error));
  });
});

exports.getFullUserProfile = (userId, apiToken) => new Promise((resolve, reject) => {
  axios.get(`https://dev-wtwvqlr1.auth0.com/api/v2/users/${userId}`, {
    headers: { authorization: `Bearer ${apiToken}` },
  }).then(fullUserProfile => {
    resolve(fullUserProfile.data.identities[0].access_token);
  }).catch(error => {
    reject(new Error(error));
  });
});

exports.getFitData = (accessToken) => new Promise((resolve, reject) => {
  axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', reqbody, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(result => {
    const fitData = result.data.bucket.map(day => {
      const date = new Date(parseInt(day.startTimeMillis));
      date.toDateString();
      const steps = day.dataset[0].point[0].value[0].intVal;
      const distance = day.dataset[1].point[0].value[0].fpVal;
      return { date, steps, distance };
    });
    resolve(fitData);
  }).catch(error => {
    reject(new Error(error));
  });
});
