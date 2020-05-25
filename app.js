const handlebars = require("handlebars");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express()

const Post = require("./database/models/Article")

//express-session
app.use(session({
  secret: 'securite',
  name: 'biscuit'
}))
//express Static
app.use(express.static('public'));


//Mongoose 
mongoose.connect("mongodb+srv://quentin:Zidane-10@article-umnus.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true}) 
.then(() => {
  console.log('connected to database');
}).catch(() => {
  console.log('failed connected to database');
});

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

  if(req.session.userId){
    res.render("articles/add")
  }
})

// POST 

app.post("/article/post", (req, res) => {

  const {
    image
  } = req.files
  const uploadFile = path.resolve(__dirname, "public/articles", image.name)
  image.mv(uploadFile, (error) => {
    Post.create({
      ...req.body,
      image: `/articles/${image.name}`
    }, (error, post) => {
      res.redirect("/")
    })
  })
})

//User
app.get("/user/register", (req, res) => {
  res.render("register")
})
const User = require("./database/models/User");

app.post("/user/register", (req, res) => {

  User.create(req.body, (error, user) => {
    if (error) {               
      const registerError = Object.keys(error.errors).map(key => error.errors[key].message)

      req.flash("registerError", registerError)
      req.flash("data", req.body)

      return res.redirect("/user/create")
    }
    res.redirect("/")
  })
})
app.get("/user/login", (req, res) => {
  res.render("login")
})

app.post("/user/login", (req, res) => {
  const {
    email,
    password
  } = req.body;

  User.findOne({
    email
  }, (error, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (same) {

          req.session.userId = user._id

          res.redirect("/")
        
        } else {
          res.redirect("/user/login")
        }
      })
    } else {
      return res.redirect("/user/login")
    }
  })
})
app.get("/user/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/")
    })
})


//contact
app.get("/contact", (req, res) => {
  res.render("contact")
})

app.listen(2000, function () {
  console.log("écoute sur le port 2000");
})