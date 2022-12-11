const express = require("express");
const helmet = require("helmet");
const dotEnv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");

//Configures the environment variables to avoid getting sensible data stolen from GitHub
dotEnv.config();

const app = express();

//Makes it so that everyone has access to our API
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

//To have access to the body of the request by intercepting all requests with a JSON mimetype
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//To differentiate the images for the posts and the images for the PfP
app.use("/images", express.static(path.join(__dirname, "images")));
//Library that protects the headers of the requests (Protects from XSS attacks)
app.use(helmet());

//Rate limiter is a library that limits the amount of requests an user can do to avoid: spam + potential DDoS
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, //MAX = 100 requêtes/h
    message: "Too many requests were sent",
});

//Synchroniser les modèles & la B2D POUR LES TESTS
const database = require("./models");
database.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and re-sync database.");
});

//Routes
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");

app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;