var express = require('express');
var router = express.Router();
var Orion = require('fiware-orion-client');

var orionClient = new Orion.Client({
  url: 'http://orion.local.teamware.it:51026/v1',
  //url: 'http://130.206.125.16:51026/v1',
  service: 'fiwareiot',
  token: 'QhqaVhWNjaRR5fHleuMvYjTCqCp3Ko',
  userAgent: 'fiware-ipd-api',
  timeout: 5000
});

/* enforce into an array contextData returned by fiware-orion-client
 * which is not the case as per how fiware-orion-client behaves
 */
var normalizeContextData = function(contextData) {
  var normalizedContextData = [];

  if (contextData && !Array.isArray(contextData)) {
    normalizedContextData.push(contextData);
  }
  else if (Array.isArray(contextData)) {
    normalizedContextData = contextData;
  }

  return normalizedContextData;
}

/* GET devices listing. */
router.get('/', function(req, res, next) {
  var queryOptions = {
    type: 'thing',
  }

  var filter = function(data) {
    return {
      device_id: data.id,
      sitename: data.SiteName.value
    }
  }

  orionClient.queryContext(queryOptions).then(function(contextData) {
    console.log('Context data:', JSON.stringify(contextData));
    res.send(normalizeContextData(contextData).map(filter));
  }, function(err) {
    console.log('Error querying context: ', error);
  })
});

/* GET Instantaneous Measurements Set. */
router.get('/:device_id/minst', function(req, res, next) {

  var queryOptions = {
    type: 'thing',
    id: req.params.device_id,
  }

  var filter = function(data) {
    return {
      device_id: data.id,
      sitename: data.SiteName.value,
      V1: data.voltage1 ? data.voltage1.value : null,
      V2: data.voltage2 ? data.voltage2.value : null,
      V3: data.voltage3 ? data.voltage3.value : null,
      I1: data.current1 ? data.current1.value : null,
      I2: data.current2 ? data.current2.value : null,
      I3: data.current3 ? data.current3.value : null,
      /* TODO: mapping to be completed */
      Ip: null,
      ThdV1: null,
      ThdV2: null,
      ThdV3: null,
      ThdI1: null,
      ThdI2: null,
      ThdI3: null,
      ThdIn: null,
      Pa1: null,
      Pa2: null,
      Pa3: null,
      Pq1: null,
      Pq2: null,
      Pq3: null,
      PApp1: null,
      PApp2: null,
      PApp3: null,
      FPot1: null,
      FPot2: null,
      FPot3: null,
      Freq1: null,
      Freq2: null,
      Freq3: null
    }
  }

  orionClient.queryContext(queryOptions).then(function(contextData) {
    console.log('Context data:', JSON.stringify(contextData));
    res.send(normalizeContextData(contextData).map(filter));
  }, function(err) {
    console.log('Error querying context: ', error);
  })
});

module.exports = router;
