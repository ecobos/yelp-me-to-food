var qs = require("querystring");
var http = require("https");

var options = {
  method: 'POST',
  hostname: 'api.yelp.com',
  port: 443,
  path: '/oauth2/token',
  headers: {
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded'
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(qs.stringify({ client_id: 'guDpGG6MgGDGzKOPvgxH_g',
  client_secret: 'Zum1vrfrstaEdUTT1fTN1UjGMYrGCQ92sxxmAAUNM8PiorZkVKZU9PSFLYc3sFt5',
  grant_type: 'client_credentials' }));
req.end();
