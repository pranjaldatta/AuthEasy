/**
 * Entry point of AuthEasy package
 * AuthEasy can :
 * 1. Create accounts (Register/SignUp)
 * 2. Authenticate accounts (Login/SignIn)
 * 
 * Index.js does the following:
 * 1. Takes in parameters of the user schema i.e. the fields a user needs to fill to signUp/register
 * 2. Takes in URI of mongoDB instance
 * 3. contains relavant methods "register" & "login" which calls necessary lib files that handle the required
 *    processes
 */

'use strict';

/**
 * Module depenencies
 *
 */

var express = require('express');
var mongoose = require("mongoose");

/**
 * @property {string} workingUri
 * @property {bool} useNewUrlParser
 */

var workingUri = "";
var _newUrlParser = false;

/**
 * @public
 * @property {function} setUri
 * @param {string} uri
 * @param {bool} resetUri
 */

function setUri(uri , reset = false , useNewUrlParser = true){
    
    if(reset == false){
        workingUri = uri;
    }else{
        workingUri = uri
        connect(workingUri, {useNewUrlParser: useNewUrlParser});
    }
    _newUrlParser = useNewUrlParser;
}

/**
 * @property {function} connect
 * @param {string} uri
 * @param {bool} useNewUrlParser 
 */
function connect(){

    mongoose.connect(workingUri, {useNewUrlParser : _newUrlParser}, function(err){
        if(err == null){
            console.log("Connected successfully!");
        }
        else{
            console.log(err);
        }

    });
}



module.exports.setUri = setUri;
module.exports.connect = connect;
module.exports.register = require("./lib/register");
module.exports.login = require("./lib/login");
module.exports.schema = require("./lib/schema");