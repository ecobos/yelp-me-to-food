/* jshint node: true */
/* jshint esversion: 6 */
'use strict';

var expect = require("chai").expect;
var DynamoAssistant = require("../app/DynamoAssistant.js");

describe("Persistent Storage", function(){
   describe("Write to storage", function(){
      it("write Minneapolis", function(){
         var dyno =  new DynamoAssistant('test');
         dyno.savePrefLocation("Minneapolis");
      });
   });

   describe("Read from storage", function(){
      it("read Minneapolis", function(){
         var dyno =  new DynamoAssistant('test');
         dyno.getPrefLocation(function(result){
            expect(result).to.equal("Minneapolis");
         });
      });
   });
});
