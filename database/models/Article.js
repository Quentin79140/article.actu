const mongoose = require("mongoose")

const ArticleSchema = new mongoose.Schema({
    title: String,
    intro: String,
    content: String,
    author:String

})

const Article = mongoose.model("Article", ArticleSchema)

module.exports = Article