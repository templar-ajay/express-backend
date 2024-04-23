const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res.status(400).json({
      message: "user and pwd are required",
    });
  }

  //check for duplicate users
  const duplicate = usersDB.users.find((_user) => _user.username === user);
  if (duplicate) {
    return res.sendStatus(409);
  } //conflict
  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store the new user
    const newUser = {
      username: user,
      role: {
        User: 2001,
      },
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users, null, 2)
    );
    console.log(usersDB.users);
    res.status(201).json({ message: `New user ${newUser.username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
