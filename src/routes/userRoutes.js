const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.post("/api/saveUser", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send("User saved");
});

module.exports = router;
