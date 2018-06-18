var express 		= require("express"),
	mongoose 		= require("mongoose"),
	bodyParser 		= require("body-parser")
	methodOverride  = require("method-override");
	expressSanitizer = require("express-sanitizer"),
	app				= express();

//app config
mongoose.connect("mongodb://localhost/myblog_app");
app.set("view engine", "ejs");	
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose confit
var myblogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created:{type:Date, default: Date.now}
});
var Myblog = mongoose.model("Myblog", myblogSchema);



//Restful config

//***********
//INDEX ROUTE
//***********


app.get("/", function(req, res){
	res.redirect("/myblogs");
})


app.get("/myblogs", function(req, res){
   Myblog.find({}).sort({created:-1}).exec(function(err, myblogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {myblogs: myblogs}); 
       }
   });
});

//***********
//NEW ROUTE
//***********

app.get("/myblogs/new", function(req, res){
	res.render("new");
});

//*****************
//CREATE NEW ROUTE
//*****************
app.post("/myblogs", function(req, res){
	//sanitize
	req.body.myblog.body = req.sanitize(req.body.myblog.body);
	//create blog
	Myblog.create(req.body.myblog, function(err, newMyblog){
		if(err){
			res.render("new");
		} else {
		res.redirect("/myblogs");
		}
	});
});

//*****************
//CREATE SHOW ROUTE
//*****************
app.get("/myblogs/:id", function(req, res){
   Myblog.findById(req.params.id, function(err, foundMyblog){
       if(err){
           res.redirect("/myblogs");
       } else {
           res.render("show", {myblog: foundMyblog});
       }
   })
});

//*****************
//CREATE EDIT ROUTE
//*****************

app.get("/myblogs/:id/edit", function(req, res){
	Myblog.findById(req.params.id, function(err, foundMyblog){
		if(err){
			res.redirect("/myblogs");
		} else {
			res.render("edit", {myblog: foundMyblog});
		}
	});

});

//*******************
//CREATE UPDATE ROUTE
//*******************

app.put("/myblogs/:id", function(req, res){
	req.body.myblog.body = req.sanitize(req.body.myblog.body);
	Myblog.findByIdAndUpdate(req.params.id, req.body.myblog, function(err, updatedMyblog){
		if(err){
		res.redirect("/myblogs");
	} else {
		res.redirect("/myblogs/" + req.params.id);
	}
	});
});


//**************************
//CREATE DESTRY/DELETE ROUTE
//**************************
app.delete("/myblogs/:id", function(req, res){
	// destory blog
	Myblog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/myblogs");
		} else {
			res.redirect("/myblogs");
		}

	});
});

app.listen(3000, function(){
	console.log("Server up")
});