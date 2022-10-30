const config = require('dotenv').config()
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const healthRouter = require("./routes/health")
const notesRouter = require("./routes/notes")
const noteRouter = require("./routes/note")

if (config.error) {
  throw config.error
}

//call env variables

const port = process.env.PORT // || 3001
const dbName = process.env.dbName // || assgn3notes

global.port = port

const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*
  TODO-1: Setup Database connection
*/


const db = mysql.createConnection ({
  host: 'localhost',
  user: 'usha2',
  password: '@@qwerty',
  database: dbName  
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  db.query(`CREATE DATABASE if not exists ${dbName}`, function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  db.query(`USE ${dbName}`, function(err,result) {
    if (err) throw err;
    console.log(`Using Database ${dbName}`);
  });
});


/*
  TODO-2: Upon database connection success, create the relavent table(s) if it does not exist.
*/

const queryCreateTable = `CREATE TABLE IF NOT EXISTS notes(id INT AUTO_INCREMENT PRIMARY KEY, text varchar(255) NOT NULL, dateCreated DATE NOT NULL, lastModified TIMESTAMP NOT NULL)`;

// Run create table
db.query(queryCreateTable, function(err, results, fields) {
  if (err) {
    console.log(err.message);
  }
  console.log('Created table: notes');  
});

global.db = db;

app.get('/', (req, res) => {
  res.send('CSBC1010 Assignment 3 - My Notes')
})

app.use("/health", healthRouter)
app.use("/notes", notesRouter)
app.use("/note", noteRouter)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

module.exports = db;
