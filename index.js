/* jshint node: true */
/*jshint esversion: 6 */
'use strict';

const Alexa = require('alexa-sdk');
const local = require('./app/GetLocalRestaurant');

const APP_ID = 'amzn1.ask.skill.dd2d38fc-8229-476a-b451-7adf778746d1';

const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Yelp Me To Food',
            HELP_MESSAGE: 'You can say, find mexican food in Minneapolis',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            WELCOME_MESSAGE: 'Hi, welcome to Yelp Me To Food'
        },
    }
};

var states = {
    SETUPMODE: '_SETUPMODE', // Setup a user's search location
    MAINMODE: '_MAINMODE',  // Prompt the user to start or restart the session.
    RESULTSMODE: '_RESULTSMODE', // User wants more information a specific venue
    CHOOSETYPE: '_CHOOSETYPE',
    CHOOSEPRICE: '_CHOOSEPRICE'
};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', this.t('WELCOME_MESSAGE')); // Likely wont get used
    },
    'GetLocalRestaturantByTerm': function () {
        var term =  this.event.request.intent.slots.term.value;
        var location = this.event.request.intent.slots.location.value;
        const self = this;
        local.GetLocalRestaturantByTerm(term, location, function(response){
            self.emit(':tell', 'Sounds good. Here is what I found on Yelp. ' + response);
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':saveState', true);
    },
};

var newSessionHandlers = {
    'NewSession': function() {

        var location = this.attributes.location;

        if(location === undefined){
            this.handler.state = states.SETUPMODE;
            var prompt = "Welcome to Yelp Me To Food. To get started I need to know your search location. What is your search location? You can say a city or zip code.";
            var reprompt = "I'm sorry but I didn't catch that. What is your search location? You can say a city or zip code.";
            this.emit(':ask', prompt , reprompt);
        } else {
            this.handler.state = states.MAINMODE;
            this.emit('MainMenu');
        }

    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.dynamoDBTableName = 'yelpUserSearchLocation';
    alexa.registerHandlers(handlers, newSessionHandlers, setupHandlers, startHandlers);
    alexa.execute();
};

//this.event.session
