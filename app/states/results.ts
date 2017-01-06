import { CreateStateHandler } from "alexa-sdk";
import { STATE } from "./definitions";
import * as Yelp from "../GetLocalRestaurant"

export let resultsModeHandler = CreateStateHandler(STATE.RESULTSMODE, {
    'NewSession': function() {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'FindFood': function() {
        this.attributes.priceType = this.event.request.intent.slots.priceType.value;

        this.emit(':ask', "Okay, do you want cheap, affordable or fancy?");
    },
    'GetFoodByTypeAndPrice': function() {
        let foodType: string = this.attributes.foodType;
        let priceType: Yelp.Price = this.attributes.priceType;
        let location: string = this.attributes.location;
        const self = this;

        let yelp = new Yelp.Yelp(location)
        yelp.getByTypeAndPrice(foodType, priceType, (resArray, error) => {
            if (error !== undefined || resArray.length === 0) {
                self.emit('error');
            }

            
            self.emit(':tell', 'Sounds good. Here is what I found on Yelp. ' + response);
        });
        local.GetLocalRestaturantByTerm(term, location, function(response) {
            self.emit(':tell', 'Sounds good. Here is what I found on Yelp. ' + response);
        });
    },
    'AMAZON.HelpIntent': function() {
        var message = "You can say either cheap for something under $10, affordable for something under $20 or fancy for something above $20";
        this.emit(':ask', message, "Please say a price type");
    },
    'SessionEndedRequest': function() {
        console.log('choosetype session ended!');
        this.emit(':saveState', true);
    },
    'Unhandled': function() {
        var message = 'Say yes to continue, or no to end the game.';
        this.emit(':ask', message, message);
    }
});
