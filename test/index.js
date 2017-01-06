/* jshint node: true */
/* jshint esversion: 6 */

const context = require("aws-lambda-mock-context");
var expect = require("chai").expect;
var index = require("../src/index");

const ctx = context();

describe("Testing a new session", function() {
    var speechResponse = null;
    var speechError = null;

    before(function(done) {
        index.Handler({
            "session": {
                "sessionId": "SessionId.447ef697-620e-4e69-887d-4e21e56aac26",
                "application": {
                    "applicationId": "my_app_id"
                },
                "attributes": {},
                "user": {
                    "userId": "amzn1.ask.account.AF6X2S7EVHVL4DPLIDZLRCU7AGVEMUR67UM34OYQWLDTGAKVMDJF2NFNK47TAO7PHYNLLPP25JKIVFNXEODGYUESFFDPVMGC2JAA5WXTQ2SLPCHYTNCB26T5H3DR3JKTBN5W4PY3C2RCWJ2WZKJHVUL57IPUNXTTMKFYQD6LSUGCYCVITQCP66XNRIFVZ7IQW54W3XI7UWLRQSA"
                },
                "new": true
            },
            "request": {
                "type": "LaunchRequest",
                "requestId": "EdwRequestId.95bd6693-212e-4441-b318-c0feebe4576e",
                "locale": "en-US",
                "timestamp": "2016-12-31T05:55:50Z"
            },
            "version": "1.0"
        }, ctx);
        ctx.Promise
            .then(response => {
                speechResponse = response;
                cosnsole.log(speechResponse);
                done();
            })
            .catch(error => {
                speechError = error;
                done();
            });
    });
});
