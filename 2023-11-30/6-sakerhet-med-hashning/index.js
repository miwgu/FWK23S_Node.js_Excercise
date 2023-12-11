let express = require("express"); // INSTALLERA MED "npm install express" I KOMMANDOTOLKEN
let app = express();
app.listen(3000);
console.log("Servern körs på port 3000");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/dokumentation.html");
});

const mysql = require("mysql2"); // INSTALLERA MED "npm install mysql" I KOMMANDOTOLKEN
con = mysql.createConnection({
  host: "localhost", // databas-serverns IP-adress
  user: "root", // standardanvändarnamn för XAMPP
  password: "", // standardlösenord för XAMPP
  database: "jensen2023", // ÄNDRA TILL NAMN PÅ ER EGEN DATABAS
  multipleStatements: true, // OBS: måste tillåta att vi kör flera sql-anrop i samma query
});

app.use(express.json());

/*
 Funktion som tar någon form av indata, t.ex. ett lösenord i klartext,
 hashar det och returnerar hashvärdet som en sträng.
*/
const crypto = require("crypto"); //INSTALLERA MED "npm install crypto" I KOMMANDOTOLKEN
function hash(data) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

// demonstrera funktonen
console.log("'Apelsin' -> " + hash("Apelsin"));
console.log("'Banan' -> " + hash("Banan"));

// samma som i tidigare exempel (hantera POST och skriva till databas), men med hashat lösenord
app.post("/users", function (req, res) {
  if (!req.body.username) {
    res.status(400).send("username required!");
    return;
  }
  let fields = ["username","password", "name", "email", ]; // ändra eventuellt till namn på er egen databastabells kolumner
  for (let key in req.body) {
    if (!fields.includes(key)) {
      res.status(400).send("Unknown field: " + key);
      return;
    }
  }

  /**
   * VIKTIGT!!!!!! to use Hash
   * Change Databas password ->VARCHAR(100)
   * POST data as hash(req.body.password)
   * */

  // OBS: näst sista raden i SQL-satsen står det hash(req.body.passwd) istället för req.body.passwd
  // Det hashade lösenordet kan ha över 50 tecken, så använd t.ex. typen VARCHAR(100) i databasen, annars riskerar det hashade lösenordet att trunkeras (klippas av i slutet)
  let sql = `INSERT INTO users (username, password, name, email)
    VALUES ('${req.body.username}', 
    '${hash(req.body.password)}',
    '${req.body.name}',
    '${req.body.email}');
    SELECT LAST_INSERT_ID();`; // OBS! hash(req.body.password) i raden ovan! When you log in this need to match with rad 82: let passwordHash = hash(req.body.password);
  console.log(sql);

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    let output = {
      id: result[0].insertId,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
    }; // OBS: bäst att INTE returnera lösenordet
    res.send(output);
  });
});

app.post("/login", function (req, res) {
  //kod här för att hantera anrop…
  let sql = `SELECT * FROM users WHERE username='${req.body.username}'`;

  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.length == 0) {
      res.sendStatus(401);
      return;
    }
    let passwordHash = hash(req.body.password);
    console.log(passwordHash);
    console.log("Password which stored in Database: "+result[0].password);
    if (result[0].password == passwordHash) {
      res.send({
        // OBS: returnera inte password!
        name: result[0].name,
        username: result[0].username,
        email: result[0].email,
      });
    } else {
      res.sendStatus(401);
    }
  });
});