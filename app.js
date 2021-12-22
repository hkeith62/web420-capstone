/*
============================================
; Title:  Web 420- RESTFul API's
; Author: Professor Krasso
; Date: 11/12/2021
; Modified By: Keith Hall
; Description: Main server file for web-420 Composer API.
;===========================================
*/
/*jslint node: true */
'use strict';
// Calls all modules to be used in this assignment.
var express = require('express');
var http = require('http');
var swaggerUi = require('swagger-ui-express'); // Set up ui and serve document
var swaggerJsdoc = require('swagger-jsdoc');  // Generate Swagger specification
var mongoose = require('mongoose');
var teamAPI = require('./routes/hall-team-routes');

var router = express.Router();


var app = express();   // Creates an express application and puts it inside the app variable.

app.set('port', process.env.PORT || 3000);

app.use(express.json());   // Returns express middleware that parses http request bodies into js objects.
app.use(express.urlencoded({'extended': true}));  // Parses incoming requests encoded in the url as a string or an array.

 //MongoDB Atlas connection string
var mongoDB = 'mongodb+srv://superadmin:s3cret@cluster0.lujih.mongodb.net/web420DB?retryWrites=true&w=majority';

mongoose.connect(mongoDB, {
    promiseLibrary: require('bluebird'),
    useUnifiedTopology: true,
    useNewUrlParser: true

}).then(() => {
    console.log(`Connection to MongoDB Atlas successful`);
}).catch(err => {
    console.log(`MongoDB Error: ${err.message}`);
})

var options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WEB 420 RESTful APIs',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'], // file containing annotations for the OpenAPI Specification
};

const openapiSpecification = swaggerJsdoc(options); // Options definitions are converted into swagger docs and held in variable.

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification, {explorer: true})); // Serve Swagger specification at api- docs, Explorer api search.
app.use('/api', teamAPI);

http.createServer(app).listen(app.get('port'), function() {
    console.log(`Application started and listening on port ${app.get('port')}`); // Starts the server listening on port 3000 using ('port') variable.
})

// Export the router
module.exports = router;