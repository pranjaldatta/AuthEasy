/*
 * Add entries to the database
*/
'use strict'
/**
 * @private
 * 
 * module dependencies
*/

var schema = require("./schema"); //add support for multiple schemas
var bcrypt = require("bcrypt");

/**
 * @public
 * @property {function} SyncRegister
 * @param {Map} fields
 */


//sync approach  
async function SyncRegister(fields, saltRounds) {
     
    fields.password = await bcrypt.hash(fields.password, saltRounds)
                                  .then(function (hash) {
                                            
                                        return hash
                                  })
                                  .catch(function (err) {
                                        console.log("error at hashing: ", err);
                                  })
    //console.log(fields)
    var newSchema = new schema.model(fields);


    await newSchema.save()
                   .then(function (document) {
                         console.log(document)
                      console.log("successfully added")
                   })
                   .catch(function (err) {
                      console.log(err);
                   })


}

module.exports.SyncRegister = SyncRegister;


