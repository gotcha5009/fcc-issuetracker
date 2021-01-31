'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
const { MongoClient } = require("mongodb");
require('dotenv').config();

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//database client
const client = new MongoClient(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app, client);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//connect to database then start listening

client.connect(err => {
  try {
    console.log('connected to database');
    app.listen(process.env.PORT || 3000, function () {
      console.log("Listening on port " + process.env.PORT);
      if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
          try {
            runner.run();
          } catch (e) {
            let error = e;
            console.log('Tests are not valid:');
            console.log(error);
          }
        }, 3500);
      }
    });

    // perform actions on the collection object
  } catch (err) {
    throw err;
  }
});
//Start our server and tests!


module.exports = app; //for testing
