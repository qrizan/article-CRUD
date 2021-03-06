var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var pug = require('pug');
var pg = require('pg');
var fs = require('fs');
var app = express();
var multer = require('multer');
var upload = multer({ dest: './public/uploads/',includeEmptyFields: true});

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
app.use(bodyParser.urlencoded({extended: false}));


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

// add
app.post('/add', upload.single('image'), function(req, res){
	pool.connect(function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  if(req.file){
	  	client.query('INSERT INTO article(title,body,image) VALUES ($1, $2, $3)',[req.body.title,req.body.body,req.file.filename]);	  	
	  }else{
	  	client.query('INSERT INTO article(title,body) VALUES ($1, $2)',[req.body.title,req.body.body]);
	  }

	  done();
	  res.redirect('/');
	});

	pool.on('error', function (err, client) {
	  console.error('idle client error', err.message, err.stack)
	})
});

// delete
app.delete('/delete/:id/:image', function(req, res){
	pool.connect(function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('DELETE FROM article WHERE id = $1',[req.params.id]);
	  fs.unlinkSync('./public/uploads/'+req.params.image);

	  done();
	  res.send(200);
	});

	pool.on('error', function (err, client) {
	  console.error('idle client error', err.message, err.stack)
	})
});

// edit
app.post('/edit', upload.single('image'), function(req, res){
	pool.connect(function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  if(req.file){
	  	client.query('UPDATE article SET title = $1, body = $2, image = $3 WHERE id = $4',[req.body.title,req.body.body,req.file.filename,req.body.id]);	  	
  		fs.unlinkSync('./public/uploads/'+req.body.oldimage);
	  }else{
	  	client.query('UPDATE article SET title = $1, body = $2 WHERE id = $3',[req.body.title,req.body.body,req.body.id]);	  		  	
	  }

	  done();
	  res.redirect('/');
	});

	pool.on('error', function (err, client) {
	  console.error('idle client error', err.message, err.stack)
	})
});

// image
app.get('/uploads', function(req, res){

});

// server
app.listen(3000, function(){
	console.log('Server started on port 3000');
});