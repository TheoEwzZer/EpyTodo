const auth = require("../../middleware/auth");

const {
  viewAllUserTodos,
  viewAllUsers,
  viewUserEmailById,
  viewUserIdByEmail,
  updateUserById,
  deleteUserById,
} = require("./user.query");

module.exports = function userRoutes(app, bcrypt) {
  app.get("/user", auth, (req, res) => {
    viewAllUsers(res);
  });

  app.get("/user/todos", auth, (req, res) => {
    const { id } = req;

    viewAllUserTodos(res, id);
  });

  app.get("/users/:id", auth, (req, res) => {
    const { id } = req.params;

    if (parseInt(id, 10).toString() !== id) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    viewUserEmailById(res, id);
  });

  app.get("/users/:email", auth, (req, res) => {
    const { email } = req.params;
    if (email === undefined) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    viewUserIdByEmail(res, email);
  });

  app.put("/users/:id", auth, (req, res) => {
    const { id } = req.params;
    const { email, name, firstname } = req.body;
    let { password } = req.body;
    if (
      id === undefined ||
      email === undefined ||
      password === undefined ||
      name === undefined ||
      firstname === undefined ||
      parseInt(id, 10).toString() !== id
    ) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    password = bcrypt.hashSync(password, 10);
    updateUserById(res, id, email, password, name, firstname);
  });

  app.delete("/users/:id", auth, (req, res) => {
    const { id } = req.params;
    if (parseInt(id, 10).toString() !== id) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    deleteUserById(res, id);
  });
};
