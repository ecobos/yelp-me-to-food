"use strict";
var Alexa = require("alexa-sdk");
var states = {
    SETUPMODE: '_SETUPMODE',
    MAINMODE: '_MAINMODE',
    RESULTSMODE: '_RESULTSMODE',
    CHOOSETYPE: '_CHOOSETYPE',
    CHOOSEPRICE: '_CHOOSEPRICE'
};
var handlers = {};
var newSessionHandlers = {
    'NewSession': function () {
        var self = this;
        var location = this.attributes.location;
        if (location === undefined) {
            self.handler.state = states.SETUPMODE;
            var prompt_1 = "Welcome to Yelp Me To Food. To get started I need to know your search location. What is your search location? You can say a city or zip code.";
            var reprompt = "I'm sorry but I didn't catch that. What is your search location? You can say a city or zip code.";
            self.emit(':ask', prompt_1, reprompt);
        }
        else {
            self.handler.state = states.MAINMODE;
            self.emit('MainMenu');
        }
    }
};
var Handler = (function () {
    function Handler(event, context, callback) {
        var alexa = Alexa.handler(event, context);
        alexa.appId = "my_app_id";
        alexa.registerHandlers(handlers);
        alexa.execute();
    }
    return Handler;
}());
exports.Handler = Handler;
