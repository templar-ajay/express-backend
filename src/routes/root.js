const express = require("express");
const router = express.Router();

router.get("^/$|^/index(.htm(l)?)?", (req, res, next) => {
  res.json({ message: "hello from scale api" });
});

module.exports = router;
