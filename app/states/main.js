/* jshint node: true */
/*jshint esversion: 6 */
const WhatCanBeSaid = "You can say find food for me, I'm feeling adventerous or change search location";

module.exports = Alexa.CreateStateHandler(states.MAINMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'MainMenu': function(){
      var location = this.attributes.location;
      this.emit(':ask', 'Welcome to Yelp Me. Your search location is ' + location + '. How can I help?', WhatCanBeSaid );
    },
    'FindFood': function() {
        this.handler.state = states.CHOOSETYPE;
        this.emit(':ask', "Okay, what type of food are you in the mood for?", "Try saying a something like Mexican or Indian.");
    },
    'Adventure': function(){
      // todo
    },
    'ChangeLocation': function(){
      // todo
    },
    'AMAZON.HelpIntent': function() {
        var message = "With your search location in mind, I will find a place for you to eat given your current taste. You can say find food for me or I'm feeling adventerous.";
        this.emit(':ask', message, WhatCanBeSaid);
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
