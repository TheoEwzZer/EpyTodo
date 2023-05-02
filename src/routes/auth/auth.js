const {
  registerUser,
  checkAccountMail,
  getMailAccount,
} = require("../user/user.query");

module.exports = function auth(app, bcrypt) {
  app.post("/register", (req, res) => {
    const { email, name, firstname } = req.body;
    let { password } = req.body;

    if (
      email === undefined ||
      password === undefined ||
      name === undefined ||
      firstname === undefined
    ) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    password = bcrypt.hashSync(password, 10);
    checkAccountMail(res, email, (callback) => {
      if (callback === 84) {
        res.status(409).json({ msg: "Account already exists" });
      } else if (callback === 0) {
        registerUser(res, email, password, name, firstname);
      } else {
        res.status(500).json({ msg: "Internal server error" });
      }
    });
  });

  app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === undefined || password === undefined) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    getMailAccount(res, email, password, bcrypt, (callback) => {
      if (callback === 84) {
        res.status(401).json({ msg: "Invalid Credentials" });
      }
    });
  });
};
