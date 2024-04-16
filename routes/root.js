const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|^/index(.htm(l)?)?", (req, res, next) => {
  //res.sendFile('./views/index.html', { root: __dirname });
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/new-page(.htm(l)?)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.htm(l)?)?", (req, res) => {
  res.redirect(301, "/new-page.html"); //302 by default
});

module.exports = router;
