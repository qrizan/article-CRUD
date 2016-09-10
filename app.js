var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var pug = require('pug');
var pg = require('pg');
var app = express();

var client = new pg.Client();

var config = {
  user: 'rizan', //env var: PGUSER
  database: 'article', //env var: PGDATABASE
  password: 'pass123', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var pool = new pg.Pool(config);


// assign the pug engine to .pug files
app.engine('pug', cons.pug);

// set .pug as the default extension
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// index
app.get('/', function(req, res){
	pool.connect(function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT * FROM article', function(err, result) {
	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.render('index',{articles: result.rows})
	    done();	    
	  })
	});

	pool.on('error', function (err, client) {
	  console.error('idle client error', err.message, err.stack)
	})
});

// server
app.listen(3000, function(){
	console.log('Server started on port 3000');
});