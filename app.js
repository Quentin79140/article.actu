const handlebars = require("handlebars");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars")



const app = express()

//Mongoose 
mongoose.connect('mongodb://localhost:27017/actu-asp')

//bodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));


//route
app.engine('hbs', exphbs({defaultLayout: "main", extname: "hbs"}));
app.set('view engine', 'hbs');


// route 

app.get(("/"), (req, res) => {
    res.render("home");
});







app.listen(4000, function(){
    console.log("écoute sur le port 4000");
    
})