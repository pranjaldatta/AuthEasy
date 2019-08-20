/**
 * We define the login logic 
 * @private
 * module imports
 */

'use strict'

var schema = require("./schema")
var bcrypt = require("bcrypt");

/**
 * @public
 * Sync login support
 * @property {function} SyncLogin
 * @param {String} checkFor // {param : val}
 * @param {String} pass
 * @property {bool} response  
 */



 
 async function SyncLogin(checkFor, pass) {

    var response = false
    
    await schema.model.findOne(checkFor ,  async function (err, document) {
            if (err !== null) {
                console.log(err);
            } else {
                
                if (document) {
                    
                    var _storedPassword = document.password
                    var pass = checkFor.password
                    

                    await bcrypt.compare(pass, _storedPassword , function (err , res) {
                        if(err) {
                            console.log(err)
                        } else {
                            response = res
                        }
                    })
                                    
                }
            }
        })
        
    return response; 
}

module.exports.SyncLogin = SyncLogin;
