
var setupHandlers = Alexa.CreateStateHandler(states.SETUPMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'SetLocation': function() {
        var location = this.event.request.intent.slots.city.value;
       if(location === undefined){
           location = this.event.request.intent.slots.zip.value.toString();
       }

       this.attributes.location = location;

       this.emit(':ask', 'I heard '+ location + '. Is that correct?');
    },
    'AMAZON.YesIntent': function() {
        this.handler.state = states.MAINMODE;
        this.emit(':tell', "Great! You're location has been set. Let's get started, how can I help?");
    },
    'AMAZON.HelpIntent': function() {
        var message = 'In order to provide useful information, I need to know your search location.';
        var reprompt = 'What is your search location?';
        this.emit(':ask', message, reprompt);
    },
    'AMAZON.NoIntent': function() {
        this.emit(':ask', "Sorry. Let's try again. What is your search location?");
    },
    'SessionEndedRequest': function () {
        console.log('Setupmode session ended!');
    },
    'Unhandled': function() {
        var message = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});
