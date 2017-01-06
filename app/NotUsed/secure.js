/* jshint node: true */
/* jshint esversion: 6 */
'use strict';

const AWS = require('aws-sdk');

var encrypted_client_id = process.env.client_id;
var decrypted_client_id;
var encrypted_client_secret = process.env.client_secret;
var decrypted_client_secret;



function processEvent(event, context, callback) {
    console.log('this was run');
}

exports.creds = (callback) => {

    const kms = new AWS.KMS();
    kms.decrypt({
        CiphertextBlob: new Buffer(encrypted_client_id, 'base64')
    }, (err, data) => {
        if (err) {
            console.log('Decrypt error:', err);
        }else {
           decrypted_client_id = data.Plaintext.toString('ascii');
           console.log('id: ' + decrypted_client_id);
        }
    });

    kms.decrypt({
        CiphertextBlob: new Buffer(encrypted_client_secret, 'base64')
    }, (err, data) => {
        if (err) {
            console.log('Decrypt error:', err);
        }else {
           decrypted_client_secret = data.Plaintext.toString('ascii');
           console.log('secret: '+ decrypted_client_secret);
        }
    });
    callback(decrypted_client_id,decrypted_client_secret);
};
