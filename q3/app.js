const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.connect().catch(console.log);

app.use(
    session({
        store: new RedisStore({
            client: redisClient
        }),
        secret: "mysecret",
        resave: false,
        saveUninitialized: false
    })
);

app.get("/", function (req, res) {
    res.redirect("/login");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {

    let username = req.body.username;
    let password = req.body.password;

    if (username === "admin" && password === "1234") {

        req.session.username = username;

        res.redirect("/home");

    } else {

        res.send("Invalid username or password");

    }
});

function checklogin(req, res, next) {

    if (req.session.username) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.get("/home", checklogin, function (req, res) {

    res.render("home", {
        username: req.session.username
    });

});

app.get("/profile", checklogin, function (req, res) {

    res.render("profile", {
        username: req.session.username
    });

});

app.get("/logout", function (req, res) {

    req.session.destroy(function () {
        res.redirect("/login");
    });

});

app.listen(3000, function () {
    console.log("Server running at http://localhost:3000");
});