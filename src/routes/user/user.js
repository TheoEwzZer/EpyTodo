const auth = require("../../middleware/auth");

const {
  viewAllUserTodos,
  viewAllUsers,
  viewUserByEmail,
  viewUserById,
  updateUserById,
  deleteUserById,
} = require("./user.query");

module.exports = function userRoutes(app, bcrypt) {
  app.get("/user", auth, (req, res) => {
    try {
      viewAllUsers(res);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.get("/user/todos", auth, (req, res) => {
    try {
      const { id } = req;
      viewAllUserTodos(res, id);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.get("/users/:data", auth, (req, res) => {
    try {
      const { data } = req.params;
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (parseInt(data, 10).toString() === data) {
        viewUserById(res, data);
        return;
      }
      if (emailRegex.test(data)) {
        viewUserByEmail(res, data);
        return;
      }
      res.status(400).json({ msg: "Bad parameter" });
      return;
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.put("/users/:id", auth, (req, res) => {
    try {
      const { id } = req.params;
      const { email, name, firstname } = req.body;
      let { password } = req.body;
      if (
        !id ||
        !email ||
        !password ||
        !name ||
        !firstname ||
        parseInt(id, 10).toString() !== id
      ) {
        res.status(400).json({ msg: "Bad parameter" });
        return;
      }
      password = bcrypt.hashSync(password, 10);
      updateUserById(res, id, email, password, name, firstname);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.delete("/users/:id", auth, (req, res) => {
    try {
      const { id } = req.params;
      if (parseInt(id, 10).toString() !== id) {
        res.status(400).json({ msg: "Bad parameter" });
        return;
      }
      deleteUserById(res, id);
    } catch (error) {
      res.status(400).json({ msg: "Internal server error" });
    }
  });
};
