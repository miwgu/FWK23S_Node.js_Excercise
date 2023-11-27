let express = require("express"); // install express
let app = express(); // create an express server-object
const crypto = require('crypto');
let session = require('express-session');// manage sessions
let port = 8080; // use port 8080
let fs = require('fs');
let path = require('path')


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
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
  });


  let users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json')).toString());
 
 //<form  action="/checklogin" method="post"> in login.html form 
app.post("/checklogin", function (req, res) {
 
  try {  
  console.log(users);

  //If user and pass is right and if there is no uer_id in the guestbook 
  for(let i=0; i<users.length; i++){
    if (users[i].user== req.body.user && users[i].pass==req.body.pass){
      //authenticated=true;

      console.log("User"+ users[i].name);
      req.session.user=users[i];
      console.log('User authenticated');
      return res.redirect("/forum.html");
  }
}

    let output = fs.readFileSync(path.join(__dirname, 'views', 'login.html')).toString();
    output = output.replace(
     "<h5>",
     "<h5>LOGIN FAILD! Please try it again!<br><hr>"
 );
 return res.send(output);

} catch (error){
  console.error('Error reading users.json:', error);
  res.send('Error reading users');

}

});


/**
 * Post
 * 1. add a heading to heading.json when click subit button
 * 2. redirect to the route forum.html 
 * 3. single HTTP request
 */
app.post("/addtopic", function(req,res){
  
  if(!req.session.user){
    res.redirect("/")
  }

  let heading= fs.readFileSync(path.join(__dirname, 'data','heading.json')).toString();
  heading= JSON.parse(heading);// from Json to Object

  let posts = fs.readFileSync(path.join(__dirname, 'data','posts.json')).toString();
  posts =JSON.parse(posts);

  let id= heading.length+1
  let name=req.body.name;
  let comment= req.body.comment;
  let time= createFormatTimeStamp(new Date());
  let user_id= req.session.user.id;

  heading.push({id,name,comment,time,user_id });// Add object to heading.json
  console.log(heading)


  req.body.name='';
  req.body.comment='';
  fs.writeFileSync(path.join(__dirname,'data','heading.json'), JSON.stringify(heading));

 return res.redirect("/forum.html");// Redirect to forum.html

});

/**
 * Get
 * Output username and heading list
 *
 */


app.get("/forum.html",function(req,res){
if(!req.session.user){
  res.redirect("/")
}

let loggedInUserName = req.session.user.name;// declare loggined username
//------------------Here show logined user name--------------------
     let output = fs.readFileSync(path.join(__dirname, 'views','forum.html')).toString();
     output =output.replace("***NAMN***", loggedInUserName );// replase here tu username

//------------------Here show heading list--------------------
      let heading = JSON.parse(fs.readFileSync(path.join(__dirname, 'data','heading.json')).toString());
      console.log(heading)
      let headingListHTML = createHeadingListHTML(heading);// create HTML here
      console.log(headingListHTML)
      
      output=output.replace("<!-- ***Here printout all heading info*** -->",headingListHTML);

      return res.send(output);
});

/**
 * function createHeadingListHTML
 * @param {*} heading
 * @returns 
 */

function createHeadingListHTML(heading) {

  let heading_html = '';
  

  for(var i=heading.length-1; i>=0; i--){
    
      heading_html+=
      `
      <div class="container p-1" >
        <form class="row p-2" action="/readtopic.html" method="get"     style="background-color:rgb(246, 218, 235);">
          <div  style="display:flex;">
          <button id="goToThread" type="submit" class="btn btn-secondary p-2 m-2 col-md-2">Läs</button>
           <p class="p-2 m-2 col-md-2 ">${heading[i].user_id}</p> 
           <p class="p-2 m-2 col-md-4 ">${heading[i].name}</p>
          </div>
        </form>
      </div>
    `
    
  }
  return heading_html;

}


app.get("/readtopic.html",function(req,res){
  if(!req.session.user){
    res.redirect("/")
  }
  res.sendFile(path.join(__dirname, 'views', 'readtopic.html'));
});

/**
 * function createFormatTimeStamp
 * @param {*} date 
 * @returns 
 */

function createFormatTimeStamp (date){
  let year = date.getFullYear();
  let month = String(date.getMonth() +1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let hours = String(date.getHours()).padStart(2, '0');
  let minutes = String(date.getMinutes()).padStart(2, '0');
  let seconds = String(date.getSeconds()).padStart(2, '0');
  let format =`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

return format;
}


app.use(express.static('public'));