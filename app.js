const handlebars = require("handlebars");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars")


const app = express()

const Post = require("./database/models/Article")

//express Static
app.use(express.static('public'));


//Mongoose 
 mongoose.connect('mongodb://localhost:27017/blog')

//bodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));


//route

app.engine('hbs', exphbs({defaultLayout: "main", extname: "hbs"}));
app.set('view engine', 'hbs');


// route 

app.get(("/"), async (req, res) => {
    const posts = await Post.find({})

    res.render("home", {posts} );
    
});

app.get("/contact"), (req,res) => {
    res.render("contact")
}

//ARTICLE

app.get("/article/add", (req, res) => {
    res.render("article/add")
})

// POST 

app.post("/article/post", (req, res) => {

    Post.create(req.body, (error, post) => {
        res.redirect("/")
    }) 
})


app.listen(4000, function(){
    console.log("écoute sur le port 4000");
    
})