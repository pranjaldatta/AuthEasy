/**
 * sendResetMail handles all the processes requried for sending password reset mail over smtp
 * Uses nodemailer for this
 */
'use strict'

//module imports
/**
 * @private
*/
var nodemailer = require('nodemailer');
const { google } = require('googleapis');
var schema = require("./schema");
var bcrypt = require("bcrypt");


/**
 * As of this moment , this library only supports sending mails over gmail. Hence we require Oauth
 * Required documentation will be added henceforth
 * @public
 */
const credentials = {
    clientID : "",
    clientSecret : "",
    refreshToken : "",
    redirectUrl : "",
    _accessToken : "",
    senderAddr : "",

    _credSet : false
    
};


//set credentials
/**
 * @public
 * @param {Object} params 
 * {
 *   clientID : "",
 *   clientSecret : "",
 *   refreshToken : "",
 *   redirectUrl : "",
 *   _accessToken : "",
 *   senderAddr : "",
 * 
 * } 
 */
async function setCredentials(params){

    console.log("setting credentials...")
    credentials.clientID = params.clientID;
    credentials.clientSecret = params.clientSecret;
    credentials.refreshToken = params.refreshToken;
    credentials.redirectUrl = params.redirectUrl;
    credentials.senderAddr = params.senderAddr
    credentials._credSet = true
    console.log("Credentials are set")
}


/**
 * @public
 * @property {Function} SetOAuth()
 * Sets Up OAuth For Gmail.
 * THROWS error if credentials is not configured
 * 
 */

async function setOAuth() {


    if(credentials._credSet == false) {
        return "Credentials not set error. Set credentials first using setCredentials"
        
    } 

    try {
    var oauth2 = google.auth.OAuth2
    const oauth2client = new oauth2(
        credentials.clientID,
        credentials.clientSecret,
        credentials.redirectUrl,
    )

    oauth2client.setCredentials({
        refresh_token : credentials.refreshToken,
    })

    const tokens = await oauth2client.refreshAccessToken()
    credentials._accessToken = tokens.credentials.access_token

    console.log("Done setting up credentials")
    }
    catch(err) {
        return {"Error at setting up OAuth": err , "credentialSet" : credentials._credSet }
    }
    
}



/**
 * @private
 * @property {String} _resetHash
 * @property {Number} _saltRounds
 *
 */

var _resetHash = ""
var _saltRounds = 10


/**
 * @public
 * @param {Object} searchParams 
 * @param {Number} saltRounds 
 * saltRounds default 10
 * @param {Object} mail 
 * Currently mail only supports default template. Will add support later
 * @param {String} receiverAddr
 * receiverAddr default null.
 * @NOTE :- If receiver address is not explicitly stated, it will look for stored addresses in database
 */

async function sendResetHash(searchParams , saltRounds ,   mail, receiverAddr = null) {

    if(credentials._credSet == false) {
        return "Credentials not set error"
    }
    
    _saltRounds = saltRounds   
    var resp_obj = null

    resp_obj = await schema.model.findOne(searchParams).then(async function(document) {
        

                
                if(document) {
                    console.log("FOUND!")
                    
                    var _password = document.password
                    var _recepientMail = null
                    var _username = null
                    
                    try {
                        _recepientMail = (receiverAddr == null) ? document.email : receiverAddr 
                    
                    } catch {
                        throw Error("Receiver Address should be either mentioned manually in sendResetMail function call or present in schema")
                    } finally {
                        if (_recepientMail == null) {
                            throw Error ("No Recepient mail address defined")
                        }
                    }
    
                    try {
                        _username = document.username
                    } catch {
                        for(p in searchParams) {
                            _username = searchParams[p]  //assuming searchparams contain only one key:value pair that is used as search elemetn. Try to make it more general
                            break
                        }
                    } finally {
                        if(_username == null) {
                            throw Error("Username is not defined")
                        }
                    }
    
                    try {
                        mail.params.username = _username,
                        mail.params.receiverAddr = _recepientMail
                    } catch {
                        throw Error("Username/Receiver addr not defined")
                    }
    
                    _resetHash = await bcrypt.hash(_password , 10)
                                             .then(function( hash) {
                                                    
                                                     return hash
                                                 })
                                             .catch(function(err) {
                                                     console.log("Error at reset hash generation : " , err)
                                                 })
    
                    mail.params.resetHash = _resetHash
    
    
                }
    
                
                
                await _sendMail(_recepientMail , mail).then(function(val) {                    
                    resp_obj = val     
                })
                return resp_obj    
        
    })
    return resp_obj
    
}

/**
 * @private
 * @param {String} receiverAddr 
 * The recepient's address
 * @param {object} body 
 * Parameters regarding the mail
 */

async function _sendMail(receiverAddr , body) {
    
    

    var _smtpTransport = nodemailer.createTransport({
        
        host : "smtp.gmail.com",
        port : 465,
        secure : true,

        auth : {
            type : "OAuth2",
            user : credentials.senderAddr,

            clientID : credentials.clientID,
            clientSecret : credentials.clientSecret,
            refreshToken : credentials.refreshToken,
            accessToken : credentials._accessToken
        
                  
        }
    })

    await _smtpTransport.verify(function(err) {

        if(err) {
            console.log("ERR at SMTP verification :  " , err)
        }else {
            console.log("SMTP verified succesfully!")        }

    })
    
 
    //The design of the template can be any. But these parameters are compulsory.The dummy values ar repalced here with the 
    //ones passed during function call.
    body.html = body.html.replace("{ username }", body.params.username)
    body.html = body.html.replace("{ ResetHash }" , body.params.resetHash)
    body.html = body.html.replace("{ ProductName }" , body.params.productName)
    body.html = body.html.replace("{ operating_system }" , body.params.operating_sys)
    body.html = body.html.replace("{ browser_name }" , body.params.browser)
    body.html = body.html.replace("{ ConpanyName }" , body.params.company_name)



    var _mailOptions = {
        from : credentials.senderAddr,
        to : (receiverAddr == null) ? body.params.receiverAddr : receiverAddr,
        subject : body.subject,
        html : body.html
        
    }

    return await _smtpTransport.sendMail(_mailOptions)
                  .then(function(info) {
                      _smtpTransport.close()
                      console.log("sent!")
                      const response = {"status" : "OK" , "sent" : "yes" , "msgID" : info.messageId , "response" : info.response , "error" : null}
                      return response
                  })
                  .catch(function(err) {
                    const response = {"status" : null , "sent" : "failed" , "msgID" : null , "response" : null , "error" : err}
                    return response
                  })




}

module.exports.setCredentials = setCredentials;
module.exports.setOAuth = setOAuth;
module.exports.sendResetMail = sendResetHash;