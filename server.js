const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

var db;

MongoClient.connect(
  "mongodb://localhost:27017/examen",
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("examen");
    app.listen(3000, () => {
      console.log("listening on 3000");
    });
  }
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/aanvraag");
});

app.get("/aanvraag", (req, res) => {
  res.render("aanvraag.ejs", {});
});

app.post("/aanvraag", (req, res) => {
  db.collection("inhaal").insert({name: req.body.name, examen: req.body.examen, reden: req.body.reden,datum: new Date(Date.now()).toISOString()}, (err, result) => {
    if (err) return console.log(err);
    res.redirect("/search");
  });
});

app.get("/search", (req, res) => {
  res.render("search.ejs", { student: "" });
});

app.post("/list", (req, res) => {
  var query = { name: req.body.name };
  var mysort = { reden: 1 };
  db.collection("inhaal")
    .find(query)
    .sort(mysort)
    .toArray(function(err, result) {
      if (err) return console.log(err);
      if (result == "") res.render("search_not_found.ejs", {});
      else res.render("search_result.ejs", { student: result});
    });
});

