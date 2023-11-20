let express = require("express"); // installera express
let app = express(); // skapa ett express server-objekt
let port = 8080; // ... som körs på port 8080

let httpServer = app.listen(port, function () {
  console.log(`Webbserver körs på port ${port}`); // samma som "Webbserver körs på port " + port
});

app.use(express.urlencoded({ extended: true })); 

let fs = require('fs');
const { stringify } = require("querystring");

//Start page and when you log out you come here
//<form class="col-12" action="/" method="get">
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/login.html");
  });

 //<form  action="/checklogin" method="post"> in login.html form 
app.post("/checklogin", function (req, res) {
  let users = JSON.parse(fs.readFileSync("users.json").toString());
  console.log(users);

  // It takes name="user" and name="pass" from input tag
  for(var i in users){
    if (users[i].user== req.body.user && users[i].pass==req.body.pass ){
    let output = fs.readFileSync("guestbook.html").toString();
    output =output.replace("***NAMN***", users[i].name );
    res.send(output);
    return;
  }  
}
let output = fs.readFileSync("login.html").toString();
output = output.replace(
    "<h5>",
    "<h5>LOGIN FAILD! Please try again!<br><hr><"
);
res.send(output);
});


app.post("/login_and_post", function(req,res){
  let guests= fs.readFileSync("guests.json").toString();
  guests= JSON.parse(guests);// from Json to Object
  let name= req.body.name;
  let comment= req.body.comment;
  guests.push({name,comment});// Add object to guest.json
  console.log(guests)
  req.body.name='';
  req.body.comment='';
  //guests= JSON.stringify(guests);//from object to JSON

  fs.writeFileSync("guests.json", JSON.stringify(guests));
  //res.set ({"content-type": "login_and_post/html;charset=utf8"});

  let guest_html = '';
  let title ="Guest Book"

  for(var i=guests.length-1; i>=0; i--){
    
      guest_html+=
      `
      <div class="container p-3" >
        <div class="row" style="background-color:rgb(246, 218, 235);">
          <div class="col-md-12">
            <p class="font-weight-bold">${guests[i].name}</p>
          </div>
          <div class="col-md-12">
            <p>${guests[i].comment}</p>
          </div>
        </div>
      </div>
    `
    
  }
  res.set("content-type", "text/html;charset=utf8");
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <title>Guest Info</title>
  </head>
      <h5 class="m-5">${title}</h5>
      <body>${guest_html}</body>
    </html>`);
});


/*
app.post ("/", function(req, res){
    let inlagg = fs.readFileSync("inlagg.json").toString();
    inlagg = JSON.parse(inlagg);
    inlagg.push(req.body);
    inlagg= JSON.stringify(inlagg);
    fs.writeFileSync(inlagg);

} )
*/