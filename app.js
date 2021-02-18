// jshint esversion: 8
// URL : https://enigmatic-hamlet-00912.herokuapp.com/

const express = require("express");
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public")); // for embeded css styles

mailchimp.setConfig({
  apiKey: myMailchimpAPIkey, // gitignore
  server: myMailchimpServer, // gitignore
});

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {
  const fName = req.body.fName;
  const lName = req.body.sName;
  const em = req.body.email;

  const listId = myMailchimpListId; // gitignore

  const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: em,
  };

  async function run() {
    try{
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
    res.sendFile(__dirname + "/success.html");
    }
    catch(err){
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("sarver started on 3000");
});
