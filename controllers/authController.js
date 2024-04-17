const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const handleLogin = async function (req, res) {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({ message: "user and pwd are required" });
  }
  const foundUser = usersDB.users.find((_user) => _user.username === user);
  if (!foundUser) {
    return res.sendStatus(401); // unauthorized
  }
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWTs
    return res.json({ message: `user ${foundUser.username} is logged in` });
  }
  res.sendStatus(401);
};

module.exports = { handleLogin };
