module.exports = Alexa.CreateStateHandler(states.CHOOSEPRICE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'PriceSelected': function() {
        this.attributes.priceType = this.event.request.intent.slots.priceType.value;
        this.handler.state = states.RESULTSMODE;
        this.emit('GetFoodByTypeAndPrice');
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
