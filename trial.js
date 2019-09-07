var index = require("./index");
var keys = require("./assets/keys");
var fs = require("fs");





var mongoose = require('mongoose');

const uri = "mongodb+srv://pranjaldatta:cU7E3wBIp6zwWITQ@yusodb-qus7o.mongodb.net/test?retryWrites=true&w=majority";
index.setUri(uri, false, useNewUrlParser = true);

fields = {
    username : String,
    password : String,
    email : String,
};


index.connect()
     .then(async function(){
        await index.schema("hello1" , fields)
        console.log("schema executed")
        var obj = {
            username : "pranjaldatta123",
            password : "hello",
            email : "pranjaldatta99@gmail.com"
        }
        //await index.register.SyncRegister(obj , 10)
        console.log("register executed")
        var res = await index.login.SyncLogin({username : "pranjaldatta123" } , "hello" );
        console.log("Login executed")
        console.log(res);

        

        creds = {
            "clientID" : keys.clientID,
            "clientSecret" : keys.clientSecret,
            'refreshToken' : keys.refreshToken,
            "senderAddr" : "dattapranjal27@gmail.com"

        }

        await index.resetPass.setCredentials(creds)
        await index.resetPass.setOAuth()
        var doc = fs.readFileSync("./lib/templates/basic.html" ,"utf8")

        
        //console.log(doc)

        var mail = {
            
            "subject" : "test" , 
            "html" : doc,
            "params" : {

                "username" : "OwnValue",
                "resetHash" : "",
                "productName" : "OwnValue",
                "operating_sys" : "OwnValue",
                "browser" : "OwnValue",
                "company_name" : "OwnValue",
                "receiverAddr" : ""
            }
        }
        var resp = null

        index.resetPass.sendResetMail({username : "pranjaldatta123"} , 10 , mail ).then(function(val) {
            console.log("on resolved finally " , val)
        })

        })

    