// Dependencies
var mongoose      = require('mongoose');
var User          = require('./model.js');

// Opens App Routes
module.exports = function(app) {

      // GET Routes
      // -----------------------------------------------------
      // Retrieve records for all users in the db
      app.get('/users', function(req, res){

          // Uses Mongoose schema to run the search (empty conditions)
          var query = User.find({});
          query.exec(function(err, users){
              if(err)
                  res.send(err);

              // If no errors are found, it responds with a JSON of all users
              res.json(users);
          });
      });

      // POST Routes
      // --------------------------------------------------------
      // Provides method for saving new users in the db
      app.post('/users', function(req, res){

         console.log("Inside post");

          // Creates a new User based on the Mongoose schema and the post body
          var newuser = new User(req.body);

          // New User is saved in the db.
          newuser.save(function(err){
              if(err)
                  res.send(err);

              // If no errors are found, it responds with a JSON of the new user
              res.json(req.body);
          });
      });

      // Retrieves JSON records for all users who meet a certain set of query conditions
      app.post('/query', function(req,res){

          // Grab all of the query parameters from the body
          var lat   = req.body.latitude;
          var long  = req.body.longitude;
          var distance = req.body.distance;
          var minAge = req.body.minAge;
          var maxAge = req.body.maxAge;
          var reqVerified = req.body.reqVerified;

          // Opens a generic Mongoose Query. Depending on the post body we will...
          var query = User.find({});

          // ...include filter by Max Dsitance (converting miles to meters)
          if(distance){

              // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat])
              query = query.where('location').near({ center: {type: 'Point', coordinates: [long,lat]},

                    maxDistance: distance * 1609.34, spherical: true});
          }

          // ...include filter by Min Age
          if(minAge){
              query = query.where('age').gte(minAge);
          }

          // ...include filter by Max Age
          if(maxAge){
              query = query.where('age').lte(maxAge);
          }

          // ...include filter for HTML5 verified Locations
          if(reqVerified){
              query = query.where('htmlverified').equals("This locations hosts meetups");
          }

          // ... Other queries will go here ...

          // Execute Query and Return the Query Results
          query.exec(function(err, users){
              if(err)
                res.send(err);

              // If no errors, respond with a JSON of all users that meet the criteria
              res.json(users);
          });
      });
};