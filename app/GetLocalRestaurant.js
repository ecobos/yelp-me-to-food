/* jshint node: true */
/*jshint esversion: 6 */
'use strict';
const http = require('https');
const secure = require('./secure');

var exports = module.exports = {};

exports.GetLocalRestaturantByTerm = function(term, location, callback){
   var encodedPath = encodeURI('/v3/businesses/search?term='+ term +'&open_now=true&location='+location );
   var token = 'F7oBpzlh4_5SrBS3b5Aa0CrKm2l6J3YEdyWL1L0AOWy9-W9-SKsnkryP600DzT1Wunx26cl5Fh88ow07nFAOEvw49O0k2jyAN3VB7f1lp38asjF2COmyXKy1xNNUWHYx';
   var options = {
        protocol: 'https:',
        host: 'api.yelp.com',
        port: 443,
        path: encodedPath,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    http.get(options, function(res) {
        console.log(res.statusCode);

        res.setEncoding('utf8');
        var rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
               var parsed = JSON.parse(rawData);
               var reply = '';
               for(var x = 0; x < 3; x++){
                  var cur = parsed.businesses[x];
                  reply += cur.name +' has as rating of ' + cur.rating + ' from '+ cur.review_count + ' reviews. ';
               }

                callback(reply);
            } catch (e) {
                callback(e.message);
            }
        });
    });

    secure.creds(function(id, secret){
       console.log('id: '+ id + ' secret: '+ secret);
    });
};
