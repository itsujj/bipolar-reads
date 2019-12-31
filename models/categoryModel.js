const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category_name: {type:String, required:true},
    books:[{
        type:Schema.Types.ObjectId,
        ref:'books'
    }]
})

module.exports = mongoose.model('categories', categorySchema);
