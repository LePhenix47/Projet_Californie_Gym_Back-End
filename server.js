const app = require("./app");
const dotEnv = require("dotenv");
dotEnv.config();

const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || 3000);

app.set("port", port);

const errorHandler = (error) => {
    if (error.sycall !== "listen") {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? "pipe" + address : "port" + port;

    switch (error.code) {
        case "EACCESS":
            console.error(bind + " requires elevated privileges (i.e Admin)");
            process.exit(1);
            break;

        case "EAADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//Initialises the Back-end server in HTTPS to avoid MITM attacks
const https = require("https");
const fileSystem = require("fs");

const options = {
    key: fileSystem.readFileSync("./certificate/key.pem"),
    cert: fileSystem.readFileSync("./certificate/cert.pem"),
};

const server = https.createServer(options, app);

server.on("error", errorHandler);

server.on("listening", () => {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port " + port;
    console.log("Listening on " + bind);
});

server.listen(port);

//Given the fact that the Front-End and the Back-End use different servers, we have to configure CORS
const CORS = require("cors");

app.use(
    CORS({
        origin: "http://localhost:4200",
        credentials: true,
    })
);
