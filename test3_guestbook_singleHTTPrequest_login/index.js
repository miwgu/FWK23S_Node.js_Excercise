let express = require("express"); // install express
let app = express(); // create an express server-object
const crypto = require('crypto');
let session = require('express-session');// manage sessions
let port = 8080; // use port 8080
let fs = require('fs');

let httpServer = app.listen(port, function () {
  console.log(`Webbserver körs på port ${port}`); // samma som "Webbserver körs på port " + port
});

app.use(express.urlencoded({ extended: true })); 

let generateKey= ()=> {
 var key= crypto.randomBytes(32).toString('hex');
 return key;
}

let userSession = app.use(session({
  secret:generateKey(),
  resave:false,
  saveUninitialized:true
}));


//Start page and when you log out you come here
//<form class="col-12" action="/" method="get">

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/login.html");
  });


  let users = JSON.parse(fs.readFileSync("users.json").toString());

 //<form  action="/checklogin" method="post"> in login.html form 
app.post("/checklogin", function (req, res) {
 
  try {
  //let users = JSON.parse(fs.readFileSync("users.json").toString());
  console.log(users);
 

  // It takes name="user" and name="pass" from input tag in guestbook.html
  for(let i=0; i<users.length; i++){
    if (users[i].user== req.body.user && users[i].pass==req.body.pass ){
      //authenticated=true;
      console.log(users[i].name);
      req.session.user=users[i];
      console.log('User authenticated');
     return res.redirect("/guestbook.html");
   }
  }

   let output = fs.readFileSync("login.html").toString();
   output = output.replace(
    "<h5>",
    "<h5>LOGIN FAILD! Please try again!<br><hr>"
);
res.send(output);

} catch (error){
  console.error('Error reading users.json:', error);
  res.send('Error reading users');

}

});


/**
 * Post
 * 1. add a guest to guests.json when click subit button
 * 2. redirect to the route guestbook.html 
 */
app.post("/addguest", function(req,res){
  
  if(!req.session.user){
    res.redirect("/")
  }

  let guests= fs.readFileSync("guests.json").toString();
  guests= JSON.parse(guests);// from Json to Object

  let {name, comment}=req.body;
  guests.push({name,comment});// Add object to guest.json
  console.log(guests)
  req.body.name='';
  req.body.comment='';
  fs.writeFileSync("guests.json", JSON.stringify(guests));
 return res.redirect("/guestbook.html");// Redirect to guestbook

});

/**
 * Get
 * Output username and guest list
 *
 */


app.get("/guestbook.html",function(req,res){
if(!req.session.user){
  res.redirect("/")
}

let loggedInUserName = req.session.user.name;// declare loggined username
//------------------Here show logined user name--------------------
     let output = fs.readFileSync("guestbook.html").toString();
     output =output.replace("***NAMN***", loggedInUserName );// replase here tu username

//------------------Here show the guest list--------------------
      let guests = JSON.parse(fs.readFileSync("guests.json").toString());
      console.log(guests)
      let guestListHTML = createGuestListHTML(guests);// create HTML here
      console.log(guestListHTML)
    
      
      output=output.replace("<!-- ***Here printout all guest info*** -->",guestListHTML);
    
      return res.send(output);
      //console.log(output)
});

/**
 * function createGuestListHTML
 * @param {*} guests
 * @returns 
 */

function createGuestListHTML(guests) {

  let guest_html = '';
  

  for(var i=guests.length-1; i>=0; i--){
    
      guest_html+=
      `
      <div class="container p-3" >
        <div class="row" style="background-color:rgb(246, 218, 235);">
          <div class="col-md-12" style="display:flex;">
           <p class="p-2">Name:</p> <p class="p-2">${guests[i].name}</p>
          </div>
          <div class="col-md-12" style="display:flex;">
          <p class="p-2">Comment:</p> <p class="p-2">${guests[i].comment}</p>
          </div>
        </div>
      </div>
    `
    
  }
  return guest_html;

}


