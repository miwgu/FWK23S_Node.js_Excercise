let express = require('express');
let app = express();
app.listen(3000);
console.log("Severn körs på port 3000")

app.get("/",function(req,res){
    res.send("Välkommen till rotsidan");

});

let fs= require("fs");
app.get ("/filhantering",function(req, res){
data = fs.readFileSync("data.txt");//läs från fil
res.set({"content-type": "text/html; charset=utf8"});//
res.write("Läser in text från fil:<br>");//
res.write(data);
res.write("<br>Hej Hej Hej")
res.send()
})

// filhantering: en enkel besöksräknare
app.get("/visitors",function(req,res){
    let antal = fs.readFileSync("visitors.txt"); // läs number från fil "default 0"
    antal = Number (antal); //gör om från text till tal
    antal++;  //Öka antal med ett
    antal = antal.toString(); //gör om tillbaka från tal till text
    fs.writeFileSync("visitors.txt", antal);
    res.send(`Denna sida har laddas ${antal} gånger`);

});