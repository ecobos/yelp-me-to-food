import * as Alexa from "alexa-sdk";
import * as setupHandlers from "./states/setup";

import * as mainHandlers from "./states/main";
import * as resultsHandlers from "./states/results";
import * as choosePriceHandlers from "./states/choose.price";
import * as chooseFoodtypeHandlers from "./states/choose.foodtype";

let APP_ID = 'amzn1.ask.skill.dd2d38fc-8229-476a-b451-7adf778746d1';

let languageStrings = {
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

let states = {
    SETUPMODE: '_SETUPMODE', // Setup a user's search location
    MAINMODE: '_MAINMODE',  // Prompt the user to start or restart the session.
    RESULTSMODE: '_RESULTSMODE', // User wants more information a specific venue
    CHOOSETYPE: '_CHOOSETYPE',
    CHOOSEPRICE: '_CHOOSEPRICE'
};

let handlers: Alexa.Handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', this.t('WELCOME_MESSAGE')); // Likely wont get used
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

let newSessionHandlers: Alexa.Handlers = {
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

export class Handler {
    constructor(event: Alexa.RequestBody, context: Alexa.Context, callback: Function) {
        let alexa = Alexa.handler(event, context);
        alexa.appId = APP_ID;
        alexa.resources = languageStrings;
        alexa.registerHandlers(handlers, newSessionHandlers, setupHandlers, mainHandlers, resultsHandlers, choosePriceHandlers, chooseFoodtypeHandlers);
        alexa.execute();
    }
}
