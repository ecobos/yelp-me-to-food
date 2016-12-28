var resultsHandlers = Alexa.CreateStateHandler(states.RESULTSMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'FindFood': function() {
        this.attributes.priceType = this.event.request.intent.slots.priceType.value;
        
        this.emit(':ask', "Okay, do you want cheap, affordable or fancy?");
    },
    'AMAZON.HelpIntent': function() {
        var message = "You can say either cheap for something under $10, affordable for something under $20 or fancy for something above $20";
        this.emit(':ask', message, "Please say a price type");
    },
    'SessionEndedRequest': function () {
        console.log('choosetype session ended!');
        this.emit(':saveState', true);
    },
    'Unhandled': function() {
        var message = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});
