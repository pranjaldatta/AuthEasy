var index = require("./index");
var keys = require("./assets/keys");
var fs = require("fs");





var mongoose = require('mongoose');

const uri = "mongodb+srv://pranjaldatta:cU7E3wBIp6zwWITQ@yusodb-qus7o.mongodb.net/test?retryWrites=true&w=majority";
index.setUri(uri, false, useNewUrlParser = true);

//we define our custom schema
fields = {
    username : String,
    password : String,
    email : String,
};

//this example uses async-await

//connecting to MongoDB
index.connect()
     .then(async function(){
        
        //creating a mongoose schema 'hello1' 
        await index.schema("hello1" , fields)
                
        //Ideally, in an appliation, these values will be received from the frontend applciation
        var obj = {
            username : "random1",
            password : "rd123",
            email : "random1@gmail.com"
        }
        
        //registering the user for the first time
        await index.register.SyncRegister(obj , 10)
        
        //Logging in a user. res holds true/false i.e. if user is registered or not respectively
        var res = await index.login.SyncLogin({username : "pranjaldatta123" } , "hello" );
        
        //defining Google OAuth Credentials. Recommended : Store all creds in a keys.js (name it whatever you want) and use 
        //them like this.
        creds = {
            "clientID" : keys.clientID,
            "clientSecret" : keys.clientSecret,
            'refreshToken' : keys.refreshToken,
            "senderAddr" : "dattapranjal27@gmail.com"

        }

        //setting up credentials and OAuth
        await index.resetPass.setCredentials(creds)
        await index.resetPass.setOAuth()
    
        //reads the dault template. Feel free to use your own template
        var doc = fs.readFileSync("./lib/templates/basic.html" ,"utf8")
        
        //Read templates.md for more details about this section
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
        
        //send the reset mail! 
        index.resetPass.sendResetMail({username : "pranjaldatta123"} , 10 , mail ).then(function(val) {
            console.log( val)
        })

        })

    
