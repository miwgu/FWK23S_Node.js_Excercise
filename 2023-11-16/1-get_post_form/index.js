let express = require('express');
let app = express () ;

let port = 8080;

let httpServer = app.listen (port, function(){
    console.log(`Webbserver körs på port ${port}`);
});

   // serva en statisk webbsida (form.html) som innehåller formulär
    app.get ("/form", function(req, res){
        res.sendFile(__dirname + "/form.html");
    });

    //hit kommer data när get-formulär skickas
    app.get ("/get-route", function(req, res){
        console.log(req.query);

        let summa = Number(req.query.tal1) * Number(req.query.tal2);
        console.log(summa)

        //res.send("Inte implementerad ännu");
        res.send(`${req.query.tal1}*${req.query.tal2}=${summa}`);
    
    });

    app.use(express.urlencoded({extended:true})) // behövs för att protocol
    // hit commer data när post-formulär skickas
    app.post ("/post-route", function(req,res){
        console.log(req.body); // 
        //res.send("Håller på att implementeras")

        let summa = Number(req.body.tal1)+ Number(req.body.tal2);
        console.log(summa)

        res.send(`${req.body.tal1}+${req.body.tal2}=${summa}`)
    })

