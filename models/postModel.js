const mongoose = require('mongoose');

const { Schema } = mongoose;

var commentSchema = new Schema({
    text:  {
        type: String,
        required: true
    },
    commenterId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const PostSchema = new Schema({
    author:{
        type:String,
        required:true
    },
    authorId:{
        type:String,
        required:true,
    },
    likers:{
        type:[String],
        required:true,
        default:[]
    },
    likesCount:{
        type:Number,
        required:true,
        default:0
    },
    text:{
        type:String,
        trim:true,
        required:true
    },
    comments:[commentSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Post',PostSchema);