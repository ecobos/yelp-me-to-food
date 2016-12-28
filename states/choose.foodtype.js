var chooseTypeHandlers = Alexa.CreateStateHandler(states.CHOOSETYPE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'TypeSelected': function() {
        this.attributes.foodType = this.event.request.intent.slots.foodType.value;
        this.handler.state = states.CHOOSEPRICE;
        this.emit(':ask', "Okay, do you want cheap, affordable or fancy?");
    },
    'AMAZON.HelpIntent': function() {
        var message = "You can say any food type category, from Mexican, America, Chinesse, Vietnamesse, Japanesse, Latin American";
        this.emit(':ask', message, "Please say a food type");
    },
    'SessionEndedRequest': function () {
        console.log('choosetype session ended!');
        //this.emit(':saveState', true);
    },
    'Unhandled': function() {
        var message = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});
