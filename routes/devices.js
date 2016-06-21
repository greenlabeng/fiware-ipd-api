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

  if (Array.isArray(contextData)) {
    normalizedContextData = contextData.map(function(data) {
      return {
        device_id: data.id,
        sitename: data.SiteName.value
      }
    })
  } else if (contextData) {
    normalizedContextData.push({ device_id: contextData.id, sitename: contextData.SiteName.value });
  }

  return normalizedContextData;
}

/* GET devices listing. */
router.get('/', function(req, res, next) {
  var queryOptions = {
    type: 'thing',
  }

  orionClient.queryContext(queryOptions).then(function(contextData) {
    console.log('Context data:', JSON.stringify(contextData));
    res.send(normalizeContextData(contextData));
  }, function(err) {
    console.log('Error querying context: ', error);
  })
});

module.exports = router;
