const mongoose = require("mongoose")

const ArticleSchema = new mongoose.Schema({
    title: String,
    intro: String,
    content: String,
    author:String,
    createDate: {
        type: Date, 
        default : new Date()
    }

})

const Article = mongoose.model("Article", ArticleSchema)

module.exports = Article