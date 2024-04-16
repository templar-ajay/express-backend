const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|^/index(.htm(l)?)?", (req, res, next) => {
  //res.sendFile('./views/index.html', { root: __dirname });
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
