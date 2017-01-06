import * as Alexa from "alexa-sdk";

let states = {
    SETUPMODE: '_SETUPMODE', // Setup a user's search location
    MAINMODE: '_MAINMODE',  // Prompt the user to start or restart the session.
    RESULTSMODE: '_RESULTSMODE', // User wants more information a specific venue
    CHOOSETYPE: '_CHOOSETYPE',
    CHOOSEPRICE: '_CHOOSEPRICE'
};

let handlers: Alexa.Handlers = {

}

let newSessionHandlers: Alexa.Handlers = {
    'NewSession': function() {

        let self: Alexa.Handler = this;

        var location = this.attributes.location;

        if (location === undefined) {
            self.handler.state = states.SETUPMODE;
            let prompt = "Welcome to Yelp Me To Food. To get started I need to know your search location. What is your search location? You can say a city or zip code.";
            let reprompt = "I'm sorry but I didn't catch that. What is your search location? You can say a city or zip code.";
            self.emit(':ask', prompt, reprompt);
        } else {
            self.handler.state = states.MAINMODE;
            self.emit('MainMenu');
        }

    }
};

export class Handler {
    constructor(event: Alexa.RequestBody, context: Alexa.Context, callback: Function) {
        let alexa = Alexa.handler(event, context);
        alexa.appId = "my_app_id";
        alexa.registerHandlers(handlers);
        alexa.execute();
    }
}
