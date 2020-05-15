const handlebars = require("handlebars");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const path = require("path");


const app = express()

const Post = require("./database/models/Article")

//express Static
app.use(express.static('public'));


//Mongoose 
mongoose.connect('mongodb://localhost:27017/blog')

// Handlebars.moment
var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);

//bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

//express file upload 
app.use(fileUpload())

//route

app.engine('hbs', exphbs({
  defaultLayout: "main",
  extname: "hbs"
}));
app.set('view engine', 'hbs');


// route 

app.get(("/"), async (req, res) => {

  const posts = await Post.find({})

  res.render("home", {
    posts
  });

});

app.get("/contact"), (req, res) => {
  res.render("contact")
}

//ARTICLE
app.get("/article/:id", async (req, res) => {
  const articles = await Post.findById(req.params.id)
  res.render("article", {
    articles
  })
})

app.get("/articles/add", (req, res) => {
  res.render("articles/add")


})

// POST 

app.post("/article/post", (req, res) => {

  const { image } = req.files
  const uploadFile = path.resolve(__dirname, "public/articles", image.name)
  image.mv(uploadFile, (error) => {
    Post.create(
      {
        ...req.body,
        image : `/articles/${image.name}`
      }
      , (error, post) => {
      res.redirect("/")
    })
  })
})

//User
app.get("/register", (req, res) => {
  res.render("register")
})
 const User = require("./database/models/User");
app.post("/user/register", (req, res) => {

  User.create(req.body, (error, user) => {
    res.redirect("/")
  })
})




app.listen(4000, function () {
  console.log("écoute sur le port 4000");

})


