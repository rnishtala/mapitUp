//Dependencies
// ------------------------------------------
var express   = require('express');
var mongoose  = require('mongoose');
var port      = process.env.PORT || 3000;
var morgan    = require('morgan');
var bodyParser    = require('body-parser');
var methodOverride    = require('method-override');
var app   = express();
var fs = require('fs');
var request = require('request');

// Meetup API
var meetup = function() {
  var key = fs.readFileSync('api_key.txt', 'utf-8');
  var url = "https://api.meetup.com";

  var composeURL = function(root, object) {
    return root + '?' + JSON.stringify(object).replace(/":"/g, '=').replace(/","/g, '&').slice(2, -2)
  }

  var get = function(params, callback, path) {
    params.key = key;

    request.get(composeURL(url + (path || '/2/open_events'), params), function(err, res, body) {
      if ( err ) {
        console.error(err);
        return false;
      }

      callback(JSON.parse(body)['results']);
    })
  }
}



// Express Configuration
// ---------------------------------------------
// Sets the connection to MongoDB
mongoose.connect("mongodb://localhost/mapitUp");

// Logging and parsing
app.use(express.static(__dirname + '/public'));                                   //sets the static files location to public
app.use('/bower_components', express.static(__dirname + '/bower_components'));    //Use BowerComponents
app.use(morgan('dev'));                                                           //log with Morgan
app.use(bodyParser.json());                                                       //parse application/json
app.use(bodyParser.urlencoded({extended: true}));                                 //parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                                       //allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));                    //parse application/vnd.api+json as json
app.use(methodOverride());

// Routes
// ------------------------------------------------
 require('./app/routes.js')(app);

// Listen
// ------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);
