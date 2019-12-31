const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String },
    description: { type: String },
    author: { type: String },
    category: {type: String},
    img_url: { type: String },
    pdf_url: { type: String }
})

module.exports = mongoose.model('books', bookSchema);
