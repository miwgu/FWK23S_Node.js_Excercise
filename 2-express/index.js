let express = require("express");// You need install express- > npm i express
let app = express();
let port = 8080;
let httpServer = app. listen(port, function(){
    console.log(`Webbserver körs på port ${port}`)
});

app.get ("/", function(req, res){
    console.log ("en klient anslöt")
    res.sendFile(__dirname+"/index.html")
});

app.get ("/undersida", function(req, res){
    console.log ("en klient anslöt")
    res.sendFile(__dirname+"/undersida.html")
});

app.use(express.static("filer")) //serva filer addera css och script för klientsida

