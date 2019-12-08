var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

//const dbConfig = process.env.DATABASE_URL;
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'location',
	user: 'postgres',
	password: 'Tunajunkie#123'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


// registration page
app.get('/', function(req, res) {
	res.render('index',{
		my_title:"Home Page"
	});
});

app.get('/preferences', function(req, res) {
	var query = 'select * from location;';
	db.any(query)
    .then(function (rows) {
        res.render('preferences',{
      		data: rows
				})

    })
    .catch(function (err) {
      console.log("Uh oh, sisters!");
        // display error message in case an error
        console.log('error', err); //if this doesn't work for you replace with console.log
        res.render('preferences', {
            title: 'Home Page',
            data: '',
        })
    })
});

app.get('/projStart', function(req, res) {
	res.render('projStart',{
		my_title:"Suggestions"
	});
});



//app.listen(process.env.PORT);
app.listen(3000);
console.log('3000 is the magic port');
