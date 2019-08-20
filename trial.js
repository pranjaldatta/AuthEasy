var index = require("./index");


var mongoose = require('mongoose');

const uri = "mongodb+srv://pranjaldatta:cU7E3wBIp6zwWITQ@yusodb-qus7o.mongodb.net/test?retryWrites=true&w=majority";
index.setUri(uri, false, useNewUrlParser = true);

fields = {
    username : String,
    password : String,
};


index.connect()
     .then(async function(){
        await index.schema("hello" , fields)
        console.log("schema executed")
        var obj = {
            username : 'pranjaldatta',
            password : 'gofuckurself'
        }
        await index.register.SyncRegister(obj , 10)
        console.log("register executed")
        var res = await index.login.SyncLogin({username : "pranjaldatta" });
        console.log("Login executed")
        console.log(res);
    })



