const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    fullname:{
        type: String,
        required: true
    },

    email:{
        type: String,
        unique: true,
        required: true
    },
    
    username:{
        type: String,
        unique: true,
        required: true
    },
    
    password:{
        type: String,
        required: true
    },
    timest:{
        type: Date,
        default: Date.now
    },
    isadmin:{
        type: Boolean,
        default: false
    },
    _PostsId:[{
        type: mongoose.Types.ObjectId,
        ref: 'blogpost'
    }]
});

const user = mongoose.model('user',UserSchema);
module.exports = user;