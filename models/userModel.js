const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email:{
        type: String,
        required:true,
        unique:true,
        match: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    },
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    followers:{
        type:[String],
    },
    following:{
        type:[String],
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User',UserSchema);