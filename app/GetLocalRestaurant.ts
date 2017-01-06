import * as https from "https";

interface httpOption {
    method: string;
    hostname: string;
    port: number;
    path: string;
    headers: Object;
}

interface Place {
    review_count: number;
    url: string;
    rating: number;
    name: string;
    price: string;
}

export const enum Price {
    cheap,
    affordable,
    fancy
}

export class Yelp {
    yelpAPI: string = "https://yelp.com/";
    location: string;
    accessToken: string;

    constructor(userLocation: string) {
        this.accessToken = "F7oBpzlh4_5SrBS3b5Aa0CrKm2l6J3YEdyWL1L0AOWy9-W9-SKsnkryP600DzT1Wunx26cl5Fh88ow07nFAOEvw49O0k2jyAN3VB7f1lp38asjF2COmyXKy1xNNUWHYx";
        this.location = userLocation;
    }

    getByTypeAndPrice(type: string, price: Price, callback: (parsedRes: Array<Place>, error: string) => void, limit = "3") {

        var priceStr: string = "";
        switch (price) {
            case Price.cheap:
                priceStr = "1";
                break;
            case Price.affordable:
                priceStr = "2";
                break;
            case Price.fancy:
                priceStr = "3,4";
            default:
                priceStr = "1"
        }

        let option: httpOption = {
            "method": "GET",
            "hostname": "api.yelp.com",
            "port": 443,
            "path": encodeURI("/v3/businesses/search?open_now=true&sort_by=rating&term=food&limit=" + limit + "&categories=" + type + "&price=" + priceStr + "&location=" + this.location),
            "headers": {
                "authorization": "Bearer " + this.accessToken,
                "cache-control": "no-cache",
            }
        };

        let responseHandler = (response, error) => {
            var results: Array<Place> = [];
            for (let place of response.businesses) {
                let placeObject: Place = {
                    review_count: place.review_count,
                    url: place.url,
                    rating: place.rating,
                    name: place.name,
                    price: place.price
                };
                results.push(placeObject);
            }
            callback(results, error);
        };

        this.placeRequest(option, responseHandler);

    }

    getRandomWithinPrice(price: Price, callback: (parsedRes: Array<Place>, error: string) => void) {
        let findRandom = (res, error) => {
            var results: Array<Place> = []

            for(var _i = 0; _i < 3; _i++){

                let min = 0;
                let max = Math.floor(res.length);
                let randomIndex: number = Math.floor(Math.random() * (max - min)) + min;
                results.push(res[randomIndex]);
            }
            callback(results, error);
        };

        this.getByTypeAndPrice("", price, findRandom, "50");
    }

    placeRequest(requestOption: httpOption, responseHandler: (res: Object, error: string) => void) {
        let self = this;
        let req = https.request(requestOption, function(res) {
            var chunks: Array<Buffer> = [];

            res.on("data", function(chunk) {
                chunks.push(<Buffer>chunk);
            });

            res.on("end", function() {
                let body: Buffer = Buffer.concat(chunks);
                let parsedBody: Object = JSON.parse(body.toString());
                var error: any = undefined;
                if(res.statusCode !== 200){
                    error = self.handleError((<any>parsedBody).error.description);
                }
                responseHandler(parsedBody, error);
            });

            res.on("error", err => self.handleError(err.message));
        });

        req.end();
    }

    handleError(message: string) {
        return "Issue encountered " + message;
    }
}
