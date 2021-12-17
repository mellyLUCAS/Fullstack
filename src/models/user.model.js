const mongoose = require('mongoose');
const Schema = mongoose.Schema; //class Shcema

const userSchema = new Schema({ //j'instancie un schema
    firstName : {
        type : String,
        required : true,
        //unique : true,
        lowercase : true,
        //default : "Anonyme" impossible que ce soit vide car required
    },

    lastName : {
        type : String,
        required : true,
        lowercase : true
    },

    email : {
        type : String,
        unique : true
    },

    password : {
        type : String
    },

    isAdmin : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('User', userSchema) //le nom qui va venir en base de données User