/* eslint-disable camelcase */
const {
  viewAllTodos,
  viewTodoById,
  createTodo,
  updateTodoById,
  deleteTodoById,
} = require("./todos.query");
const auth = require("../../middleware/auth");
const notFound = require("../../middleware/notFound");

module.exports = function todoRoutes(app) {
  app.get("/todos", auth, (req, res) => {
    viewAllTodos(res);
  });

  app.get("/todos/:id", auth, notFound, (req, res) => {
    const { id } = req.params;
    if (parseInt(id, 10).toString() !== id) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    viewTodoById(res, req.params.id);
  });

  app.post("/todos", auth, (req, res) => {
    const { title, description, due_time, user_id, status } = req.body;
    if (
      title === undefined ||
      description === undefined ||
      due_time === undefined ||
      user_id === undefined ||
      status === undefined
    ) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    createTodo(res, title, description, due_time, user_id, status);
  });

  app.put("/todos/:id", auth, (req, res) => {
    const { id } = req.params;
    const { title, description, due_time, status } = req.body;
    if (
      id === undefined ||
      title === undefined ||
      description === undefined ||
      due_time === undefined ||
      status === undefined ||
      parseInt(id, 10).toString() !== id
    ) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    updateTodoById(res, title, description, due_time, status, id);
  });

  app.delete("/todos/:id", auth, (req, res) => {
    const { id } = req.params;
    if (parseInt(id, 10).toString() !== id) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    deleteTodoById(res, req.params.id);
  });
};
