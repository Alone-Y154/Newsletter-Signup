const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

// represents all the local static files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req,res)=> {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",(req,res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  // console.log(firstName ,lastName ,email );

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }

      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us14.api.mailchimp.com/3.0/lists/cd434c4757";
  const options = {
    method: "POST",
    auth: "yo:4c5f4cf88a550dc4cff01b0ae0f75083-us14"
  }
  const request = https.request(url,options,(response) => {
    if (response.statusCode === 200) {
        res.sendFile(__dirname + "/sucess.html");
    }else {
          res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",(data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);

  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,()=> {
  console.log("server is online");
});
