var mongojs = require("mongojs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var logger = require("morgan");
var exphbs = require("express-handlebars");

var app = express();

app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(express.static("public"));
  
// Database configuration
var databaseUri = 'mongodb://localhost/mlbHeadlines';

if(process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}else{
  mongoose.connect(databaseUri)
};

var databaseUrl = "mlbHeadlines";
var collections = ["headlines", "notes"];
  
// Hook mongojs config to db variable
var db = mongoose.connection;
  
// Log any mongojs errors to console
db.on("error", function(error) {
  console.log("Database Error:", error);
});

db.once('open', function(){
  console.log('Mongoose Connection Successful')
})

//handlebars
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");
  
// Routes
// ======
  
app.get("/", function(req, res) {
      res.render("index", res);
});

app.get("/all", function (req, res){
  db.headlines.find({}, function(error, data){
    if (error) {
      console.log(error);
    }
    else {
      res.send(data);
    }
  });
});

app.get("/scrape", function(req, res){

  request("https://www.mlb.com/", function(error, response, html) {

    // Load the body of the HTML into cheerio
    var $ = cheerio.load(html);

    // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
    $("div.u-text-h4.u-text-flow").each(function(i, element) {

      // Save the text of the h4-tag as "title"
      var title = $(element).text();

      // Find the h4 tag's parent a-tag, and save it's href value as "link"
      var link = $(element).parent().attr("href");

      if (title && link) {
      // Make an object with data and send it to mongodb
        db.headlines.insert({
        title: title,
        link: link,
        saved: false,
        note: ""
        },

        function (err, data){
          if (err) {
            console.log(err);
          }
          else {
          console.log(data);
          }
        })
      };
    });
  })
  res.send("Scrape Complete");
});

app.put("/saved/:id", function (req, res) {

  db.headlines.update({
    _id: mongojs.ObjectId(req.params.id)
  },
  {
    $set: {
      saved: true
    }
  },
  function(error, data) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(data);
      res.send(data);
    }
  }
  )
});



app.put("/unsaved/:id", function (req, res) {

  db.headlines.update({
    _id: mongojs.ObjectId(req.params.id)
  },
  {
    $set: {
      saved: false
    }
  },
  function(error, data) {
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      console.log(data);
      res.send(data);
    }
  }
  )
});

app.post("/notes/:id", function (req, res) {

  db.note.insert(req.body, function(err, data){
    db.headlines.findOneAndUpdate({ _id: mongojs.ObjectID(req.params.id) }, { note: mongojs.ObjectID(data._id) }, function(err, data){
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        console.log(data);
        res.send(data);
      }
    })
  })
});

app.delete("/clear", function(req, res){
  db.headlines.remove({}, function (err, data){
    if (err){
      console.log(error);
      res.send(error);
    }else{
      res.send(data);
    }
  });
});

app.get("/saved", function (req, res){

  db.headlines.find({saved: true}, function (err, data){
    if(err){
      console.log(error);
      res.send(error);
    }
    else{
      console.log(data);
      res.send(data);
    }
  });
});

app.get("/saved/:id", function (req, res){
  db.headlines.find({_id: mongojs.ObjectId(req.params.id)}, function (err, data){
    if(err){
      console.log(error);
      res.send(error);
    }
    else{
      console.log(data);
      res.json(data);
    }
  });
});

app.get("/myarticles", function (req, res){
  res.render("myarticles", res);
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});