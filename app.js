const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members:[
      {
        email_address: email,
        status:"subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data); // This is what we'll send to mailchimp

  const url ="https://us8.api.mailchimp.com/3.0/lists/956cd09c59";

  const options = {
    method: "POST",
    auth: "nasser1:e7f00256f92c5c2bdf124e602ad3f27e-us8"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 2000){
      res.sendFile(__dirname + "/success.html");
    } else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});

app.post("/failure.html", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on Heroku or port 3000 ...");
});


// API Key
// e7f00256f92c5c2bdf124e602ad3f27e-us8

// List ID
// 956cd09c59
