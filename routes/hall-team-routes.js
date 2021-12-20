/*
============================================
;   Title: WEB 420 – RESTful APIs
;   Author: Professor Krasso
;   Date: 12/15/2021
;   Modified By: Keith Hall
;   Description: Endpoints for the Team API.
===========================================
*/
// Required modules
var express = require('express');
var Team = require('../models/hall-team');

var router = express.Router();

// OpenAPI Specification
/**
 * findAllTeams
 * @openapi
 * /api/teams:
 *   get:
 *     tags:
 *       - Teams
 *     description: Returns a list of all teams in MongoDB
 *     summary: List all teams
 *     responses:
 *       '200':
 *         description: Returns an array of teams
 *         content:
 *           application/json:
 *             schema:
 *             type: array
 *             description: List teams by name, home field (name), phone, email, players, and mascot
 *             items:
 *               type: array
 *               required:
 *                 - name
 *                 - home_field
 *                 - phone
 *                 - email
 *                 - admission_date
 *                 - players
 *                 - mascot
 *               properties:
 *                 name:
 *                   type: string
 *                 home_field:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *                 admission_date:
 *                   type: string
 *                 players:
 *                   type: array
 *                   items:
 *                       type: object
 *                       properties:
 *                           player_id:
 *                               type: string
 *                           first_name:
 *                               type: string
 *                           last_name:
 *                               type: string
 *                           position:
 *                               type: string
 *                           annual_salary:
 *                               type: number
 *                 mascot:
 *                   type: string
 *       '500':
 *         description: Server has encountered an unexpected error
 *       '501':
 *         description: MongoDB Exception
 */
 router.get('/teams', async(req, res) => {

    try {

        Team.find({}, function(err, teams) {  // Finds all team documents

            if (err) {
                console.log(err);
                res.status(500).send({
                    'message': `Server has encountered an unexpected error ${err}`
                })

            } else {
                console.log(teams); // Display team documents in the console
                res.json(teams);
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server has encountered an unexpected error ${e.message}`
        })
    }
})
/**
 * createTeams
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     description: Creates a new team record in MongoDB
 *     summary: Add a new team
 *     requestBody:
 *       description: Team information recorded in MongoDB
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - home_field
 *               - phone
 *               - email
 *               - admission_date
 *               - players
 *               - mascot
 *             properties:
 *               name:
 *                 type: string
 *               home_field:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               admission_date:
 *                 type: string
 *               players:
 *                 type: array
 *                 items:
 *                     type: object
 *                     properties:
 *                         player_id:
 *                             type: string
 *                         first_name:
 *                             type: string
 *                         last_name:
 *                             type: string
 *                         position:
 *                             type: string
 *                         annual_salary:
 *                             type: number
 *               mascot:
 *                 type: string
 *     responses:
 *       '200':
 *          description: |
 *           * The new team record is added to MongoDB
 *           * Returns confirmation message
 *       '500':
 *         description: Server encountered an unexpected error
 *       '501':
 *         description: MongoDB exception
 */
 router.post('/teams', async(req, res) => {

    try {

        // JavaScript object containing the key-value pairs submitted in the request body
        const newTeam = {
            name: req.body.name,
            home_field: req.body.home_field,
            phone: req.body.phone,
            email: req.body.email,
            admission_date: req.body.admission_date,
            players: req.body.players,
            mascot: req.body.mascot
        }
        // Accesses parsed request bodies
        await Team.create(newTeam, function(err, team) {

            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception. ${err}`
                })

            } else {
                console.log(`Team was added to MongoDB ${team}`); //Team doc and message displayed in console
                res.json(team);
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server has encountered an unexpected error ${e.message}`
        })
    }
})
/**
 * assignPlayerToTeam
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     tags:
 *       - Players
 *     name: assignPlayerByTeamId
 *     description: Assign a new player to a team
 *     summary: Assigns a new player document by team id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier generated by MongoDB
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Player information recorded in MongoDB
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - player_id
 *               - first_name
 *               - last_name
 *               - position
 *               - annual_salary
 *             properties:
 *               player_id:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               position:
 *                 type: string
 *               annual_salary:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Player assigned
 *       '401':
 *         description: A problem occurred. Please check id
 *       '400':
 *         description: A problem occurred. Id is required
 *       '500':
 *         description: Server has encountered an unexpected error
 *       '501':
 *         description: MongoDB Exception
 */

 router.post('/teams/:id/players', async(req, res) => {

    try {
        Team.findOne({'_id': req.params.id}, function(err, team) {   // Finds a team document by id entered

            if (err) {
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                }),
                res.status(401).send({
                    'message': `A problem occurred. Please check id: ${err}`
                })

            } else {
                const newPlayer = {                    // Player document
                    player_id: req.body.player_id,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    position: req.body.position,
                    annual_salary: req.body.annual_salary
                };

                team.players.push(newPlayer);    // Adds player document to team-player array
                team.save(function(err, updatedTeam) {  // Call the save() function on the returned object and update

                    if (err) {
                        res.status(501).send({
                            'message': `MongoDB Exception: ${err}`
                        })

                    } else {
                        console.log(`Player assigned to: ${updatedTeam}`);
                        res.json(updatedTeam);
                    }
                })
            }
        })

    } catch (e) {
        res.status(400).send({
            'message': `A problem occurred, Id is required ${e.message}`
        }),
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        })
    }
})

/**
 * findAllPlayersByTeamId
 * @openapi
 * /api/teams/{id}/players:
 *   get:
 *     tags:
 *       - Players
 *     description: Display all players of a team
 *     summary: Display all players of a team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique identifier generated by MongoDB
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description:  Returns an array of players
 *         content:
 *           application/json:
 *             schema:
 *             type: array
 *             description: List players by name, id, position, and salary
 *             items:
 *               type: array
 *               required:
 *                 - player_id
 *                 - first_name
 *                 - last_name
 *                 - position
 *                 - annual_salary
 *               properties:
 *                 player_id:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 position:
 *                   type: string
 *                 annual_salary:
 *                   type: number
 *       '401':
 *         description: A problem occurred. Please check id
 *       '400':
 *         description: A problem occurred. Id required
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */

 router.get('/teams/:id/players', async(req,res) => {

    try{
        Team.findOne({'_id': req.params.id}, function(err, team) {

            if(err) {
                res.status(500).send({
                    'message': `MongoDB Exception: ${err}`
                }),
                res.status(401).send({
                    'message': `A problem occurred. Please check id ${err}`
                })

            } else {
                console.log(team);
                res.status(200).send(team.players)
            }
        })

    } catch (e) {
        res.status(400).send({
            'message': `A problem occurred. Id required ${err}`
        })
        res.status(500).send({
            'message': `Server has encountered an unexpected error ${e.message}`
        })
    }
})

/**
 * deleteTeamById
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     name: deleteTeam
 *     description: API for deleting a team document from MongoDB.
 *     summary: Removes a team from MongoDB.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the document to remove.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Team is deleted
 *       '401':
 *         description: A problem occurred. Please check id
 *       '400':
 *         description: A problem occurred. Id is a required field
 *       '500':
 *         description: Server encountered an unexpected error
 *       '501':
 *         description: MongoDB Exception
 */
 router.delete('/teams/:id', async (req, res) => {

    try {
        const teamDocId = req.params.id;
        Team.findByIdAndDelete({'_id': teamDocId}, function(err, team) {

            if (err) {
                console.log(err);
                res.status(401).send({
                    'message': `A problem occurred. Please check id: ${err}`
                }),
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })

            } else {
                console.log('Team was deleted');
                res.json(team);
            }
        })

    } catch (e) {
        console.log(e);
        res.status(400).send({
            'message': `A problem occurred. Id is a required field ${e.message}`
        }),
        res.status(500).send({
            'message': `Server has encountered an unexpected error: ${e.message}`
        })
    }
})

// Export the router
module.exports = router;