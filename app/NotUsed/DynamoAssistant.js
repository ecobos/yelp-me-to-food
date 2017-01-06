/* jshint node: true */
/* jshint esversion: 6 */
'use strict';

var credentials = {
   // Check the AWS IAM console
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // 4A
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // QU/7
    region: 'us-east-1'
};

const dynasty = require("dynasty")(credentials);

var locationTable = function(){
   return dynasty.table('yelpUserPrefLocation');
};

var dynoClass = DynamoAssistant.prototype;

function DynamoAssistant(userId) {
      this.mUserId = userId;
      this.mTable = dynasty.table('yelpUserPrefLocation');
}

dynoClass.savePrefLocation = function(dataToSave){
         this.mTable.insert({
            userid: this.mUserId,
            data: dataToSave
         });
      };

dynoClass.getPrefLocation = function(callback){

      this.mTable.find(this.mUserId)
         .then(function(result){
            // parse data if available
            if(result !== undefined){
               callback(result.data);
            }
            // do something with the data
         }).catch(function(error){
            console.log(error);
         });

   };

module.exports = DynamoAssistant;
