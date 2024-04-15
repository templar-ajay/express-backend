const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3000;
require("dotenv").config();

// custom middleware: log requests
app.use(logger);

// third party middleware cors for allowing cross origin resource sharing
const whitelist = [
  "https://www.google.com",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow origin as undefined in development environment
    if (whitelist.includes(origin) || (process.env.ENV === "dev" && !origin)) {
      callback(null, true);
    } else {
      callback(new Error("origin blocked, not allowed by CORS"));
    }
    console.log("origin", origin);
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// built in middleware to handle urlencoded data
// in other words, form data
// 'content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.htm(l)?)?", (req, res, next) => {
  //res.sendFile('./views/index.html', { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.htm(l)?)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.htm(l)?)?", (req, res) => {
  res.redirect(301, "/new-page.html"); //302 by default
});

// Route handlers
app.get(
  "/hello(.htm(l)?)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello World!");
  }
);

// chaining route handlers
const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

const three = (req, res) => {
  console.log("three");
  res.send("Finished!");
};

app.get("/chain(.htm(l)?)?", [one, two, three]);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({
      error: "404 not found",
    });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
