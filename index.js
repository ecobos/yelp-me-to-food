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
    STARTMODE: '_STARTMODE',  // Prompt the user to start or restart the session.
    DETAILMODE: '_DETAILMODE' // User wants more information a specific venue

};

const handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', this.t('WELCOME_MESSAGE'));
    },
    'SetLocation': function () {
        var location = this.event.request.intent.slots.city.value;
        if(location === undefined){
            location = this.event.request.intent.slots.zip.value.toString();
        }

        this.attributes['location'] = location;
        this.handler.state = states.STARTMODE;
        this.emit(':ask', 'Thank you. I heard '+ location + '. Lets get started. What type of food are you in the mood for tonight?' );
    },
    'GetLocalRestaturantByTerm': function () {
        const location = this.attributes.location;
        console.log('Heard city: ' + location);

        const term = this.attributes.foodType;
        console.log('Heard term: ' + term);
        const self = this;
        local.GetLocalRestaturantByTerm(term, location, function(response){
            self.emit(':tell', 'Sounds good. Here is what I found on Yelp. ' + response);
        });
    },
    'GetLocalRestaurantByRating': function() {

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

        var location = this.attributes['location'];

        if(location === undefined){
            this.handler.state = states.SETUPMODE;
            this.emit(':ask', 'Welcome to Yelp Me To Food. To get started I need to know your search location. What is your search location? This can either be a city or zip code.', 'Hello?');
        } else {
            this.handler.state = states.STARTMODE;
            this.emit(':ask', 'Welcome to Yelp Me. Your search location is ' + location + '. Would you like me to find you a place to eat?',
                'Say yes to start the search of no to quit. Alternatively, you can say: change my location to your town, USA');
        }

    }
};

var setupHandlers = Alexa.CreateStateHandler(states.SETUPMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'SetLocation': function() {
        this.emit('SetLocation');
    },
    'AMAZON.HelpIntent': function() {
        var message = 'In order to provide useful information, I need to know your search location.';
        var reprompt = 'What is your search location?';
        this.emit(':ask', message, reprompt);
    },
    'AMAZON.NoIntent': function() {
        this.emit(':tell', 'Ok, see you next time!');
    },
    'SessionEndedRequest': function () {
        console.log('Setupmode session ended!');
    },
    'Unhandled': function() {
        var message = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});

var startHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'SelectFoodType': function() {
        this.attributes.foodType = this.event.request.intent.slots.foodType.value;
        this.handler.state = states.DETAILMODE;
        this.emit('GetLocalRestaturantByTerm');
    },
    'AMAZON.HelpIntent': function() {
        var message = 'With your search location in mind, I will find a place for you to eat given your current taste. Would you like me to find you a place to eat?';
        this.emit(':ask', message, 'Say yes to start the search of no to quit.');
    },
    'AMAZON.YesIntent': function() {

        this.emit(':ask', 'What type of food are you in the mood for tonight?', 'Try saying a something like Mexican or Indian.');
    },
    'AMAZON.NoIntent': function() {
        this.emit(':tell', 'Ok, see you next time!');
    },
    'SessionEndedRequest': function () {
        console.log('startmode session ended!');
        this.emit(':saveState', true);
    },
    'Unhandled': function() {
        var message = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});

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
