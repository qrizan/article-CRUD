var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var pug = require('pug');
var pg = require('pg');
var app = express();

var connect = "postgres://rizan:pass123@localhost/article";

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
	// console.log('Test');
	res.render('index');
});

// server
app.listen(3000, function(){
	console.log('Server started on port 3000');
});