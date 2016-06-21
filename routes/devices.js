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

var queryOptions = {
  type: 'thing',
}

/* GET devices listing. */
router.get('/', function(req, res, next) {
  orionClient.queryContext(queryOptions).then(function(contextData) {
    console.log('Context data', JSON.stringify(contextData));

    var filteredData = [];
    if (Array.isArray(contextData)) {
      console.log('array');
      filteredData = contextData.map(function(data) {
        return {
          device_id: data.id,
          sitename: data.SiteName.value
        }
      })
    } else if (contextData) {
      console.log('not array');
      filteredData.push({ device_id: contextData.id, sitename: contextData.SiteName.value });
    }
    res.send(filteredData);
  }, function(err) {
    console.log('Error querying context: ', error);
  })
});

module.exports = router;
