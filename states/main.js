/* jshint node: true */
/*jshint esversion: 6 */
const WhatCanBeSaid = "You can say find food for me, I'm feeling adventerous or change search location";

var mainHandlers = Alexa.CreateStateHandler(states.MAINMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'MainMenu': function(){
      this.emit(':ask', 'Welcome to Yelp Me. Your search location is ' + location + '. How can I help?', WhatCanBeSaid );
    },
    'FindFood': function() {
        this.handler.state = states.CHOOSETYPE;
        this.emit(':ask', "Okay, what type of food are you in the mood for?");
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
    'AMAZON.YesIntent': function() {
        this.handler.state = states.CHOOSETYPE;
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
