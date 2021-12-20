/*
============================================
;   Title: WEB 420 – RESTful APIs
;   Author: Professor Krasso
;   Date: 12/15/2021
;   Modified By: Keith Hall
;   Description: Team model and schema
===========================================
*/
// Require and use Mongoose for Customer schema.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema defining structure of the players document and binds to variable
var playerSchema = new Schema({
    player_id: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    position: {type: String},
    annual_salary: {type: Number}
});

// Schema defining structure of the team document and binds to variable
var teamSchema = new Schema({

    name: {type: String},
    home_field: {type: String},
    phone: {type: String},
    email: {type: String},
    admission_date: {type: String, default: new Date()},
    players: [playerSchema],  // Nested schema
    mascot: {type: String}

});

// Define team model
var Team = mongoose.model('Team', teamSchema); // Mongoose maps teamSchema to Team model.
module.exports = Team;  // Exports this model for accessibility from other JavaScript files.

