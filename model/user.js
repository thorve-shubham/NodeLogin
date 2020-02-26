const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = new mongoose.Schema({
    name : {
        type :String,
        required : true,
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

userSchema.methods.genAuthToken = function(){
    return jwt.sign({ _id : this._id},config.get('privateKey'));
}

const User = mongoose.model('User',userSchema);

function validate(user){

    const complexityOptions = {
        min: 10,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 2,
      }

    validSchema = {
        name : Joi.string().min(6).max(30).required(),
        email : Joi.string().min(10).max(50).email().required(),
        
    }

    const {error} = Joi.validate(user,validSchema);
    if(error) return error;
    if(!error) return PasswordComplexity(complexityOptions).validate(user.password);
}

function validateLogin(user){
    
    const complexityOptions = {
        min: 10,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 2,
      }

    validSchema = {
        email : Joi.string().min(10).max(50).email().required(),
        
    }
   
    const {error} = Joi.validate(user,validSchema);
    if(error) return error;
    if(!error) return PasswordComplexity(complexityOptions).validate(user.password);
}



module.exports.User = User;
module.exports.validate = validate;
module.exports.validateLogin = validateLogin; 