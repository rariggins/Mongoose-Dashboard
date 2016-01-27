// require the path module
var path = require("path");

// require the express module
var express = require("express");
var app = express();

// require the ejs module
var ejs = require('ejs');

// Static Folder (css, img, etc...)
app.use(express.static(path.join(__dirname, "./static")));

// Templating Engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


// var my_module = require('./static/js/date');
// my_module.myDate();
// my_module.bDate();

// require the body-parser module
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended:true
}));

// requre the mongoose module
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/animals')

// Set up the document for the collection

var CatSchema = new mongoose.Schema({
	name: { type: String, require: true },
	birthday: { type: Date, require: true },
	gender: { type: String },
	breed: { type: String, require: true },
	park: { type: String, require: true },
	siblings: [],
	image: { type: String},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now } 
});

// simple validations
CatSchema.path('name').required(true, 'Name field cannot be blank\n');
CatSchema.path('birthday').required(true, 'Birthday field cannot be blank\n');
CatSchema.path('gender').required(true, 'Please select a gender\n');
CatSchema.path('breed').required(true, 'Breed field cannot be blank\n');
CatSchema.path('park').required(true, 'Park field cannot be blank\n');

// Retrieve Cat Model
var Cat = mongoose.model('Cat', CatSchema);

// ROUTES
// root route to render the index.ejs view
app.get('/', function(req, res) {
	// retrieve quotes, name and createdAt from database
	Cat.find({}, null, {group: { breed: -1 }}, function(err, data) {
		if(err) {
			console.log('something went wrong');
		} else {
			console.log('found some documents!')
			console.log(data);

			res.render("index", {cats: data})
		}
	})
})

app.get('/animals/new', function(req, res) {
	res.render("add");
})

app.get('/animals/:id', function(req, res) {
	console.log("I'm here");
	console.log("id: ", req.params.id);
	Cat.findOne({_id: req.params.id}, function(err, record) {
		if(err) {
			console.log('Houston, we have a problem!');
		} else {

			res.render("view_one", {record: record});
		}
	})
})

app.get('/animals/:id/edit', function(req, res) {
	console.log("id: ", req.params.id);
	Cat.findOne({_id: req.params.id}, function(err, record) {
		if(err) {
			console.log("Toto, I've a feeling we're not in Kansas anymore!");
		} else {
			res.render("edit", {record: record});
		}
	})
})

app.get('/animals/:id/destroy', function(req, res) {
	console.log("id: ", req.params.id);
	Cat.remove({_id: req.params.id}, function(err, record) {
		if(err) {
			console.log("Well, that went straight to the bit bucket!");
		} else {
			res.redirect('/');
		}
	})
})

app.post('/update_animal/:id', function(req, res) {
	console.log("POST DATA", req.body);

	updateValues = {name: req.body.name, birthday: req.body.bdate,
					gender: req.body.gender, breed: req.body.breed, 
					park: req.body.park, image: req.body.image, 
					siblings: req.body.sibling}

	Cat.update({_id: req.params.id}, updateValues, {upsert: true},
		function(err) {
			if(err) {
				console.log('something went horribly wrong! ABORT! ABORT!');
				console.log(err);
				postErrors = err;
				// res.redirect(postErrors, '/');
			} else {
				console.log('successfully updated an animal!');
				res.redirect('/');
			}
		});
})


app.post('/new_animal', function(req, res) {
	console.log("POST DATA", req.body);

	// create a new cat entry with the name, birthday, gender, breed and createdAt date corresponding to those from req.body
	var catInstance = new Cat({name: req.body.name, birthday: req.body.bdate, 
		gender: req.body.gender, breed: req.body.breed, park: req.body.park,
		image: req.body.image, siblings: req.body.sibling});
	
	console.log(catInstance);

	// method to insert into db and run a callback function with an error (if any from the operation)
	catInstance.save(function(err) {
		if(err) {
			console.log('something went horribly wrong! ABORT! ABORT!');
			console.log(err);
			postErrors = err;
			// res.redirect(postErrors, '/');
		} else {
			console.log('successfully added a new animal!');
			res.redirect('/');
		}
	})
})

app.listen(8000, function() {
	console.log("listening on port 8000");
})
