const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const dbName = "database.db";

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const db = new sqlite3.Database(dbName, (err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log(`Database Loaded Successfully-DB-Name: ${dbName}`);
    }
});

db.run(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    time DATATIME DEFAULT CURRENT_TIMESTAMP
    )`);

app.get("/", (req, res)=>{
    
// This Reads the DB and gets all the blogs and send it via blogs = rows as a array

db.all(`SELECT*FROM blogs`, [], (err, rows)=>{
    if (err) {
        throw err;
    } else {
        res.render("index",{
            blogs: rows
        });
    }
});
});

app.get("/admin", (req, res)=>{
    
// This Reads the DB and gets all the blogs and send it via blogs = rows as a array

db.all(`SELECT*FROM blogs`, [], (err, rows)=>{
    if (err) {
        throw err;
    } else {
        console.log(rows);
        
        res.render("admin",{
            blogs: rows
        });
    }
});
});

app.post("/removeblog", (req, res)=>{

    const idRemove = req.body.id;
    console.log(`Trying to removing _id:${idRemove}`);

    db.run(`DELETE FROM blogs WHERE id = ?`, [idRemove], (err)=>{
        if (err) {
            console.log(err.message);
        }else{    
            res.render("removesuccess");
            console.log(`_id:${idRemove} Removed Successfully!`);
        }
    });
});

app.get("/addblog", (req, res)=>{
    res.render("addblog");
});

app.post("/addblog", (req, res)=>{

    db.run(`INSERT INTO blogs (title, content) VALUES (?, ?)`, [req.body.title, `${req.body.content}`]);
    console.log(`Blog Added,\n Title: ${req.body.title}\n Content: ${req.body.content}`);
    

    res.redirect("/");
});

app.listen(PORT, ()=>console.log(`Server is running on http://localhost:${PORT}`));