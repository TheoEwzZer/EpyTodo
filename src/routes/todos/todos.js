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
    try {
      viewAllTodos(res);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.get("/todos/:id", auth, notFound, (req, res) => {
    try {
      const { id } = req.params;
      if (parseInt(id, 10).toString() !== id) {
        res.status(400).json({ msg: "Bad parameter" });
        return;
      }
      viewTodoById(res, req.params.id);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.post("/todos", auth, (req, res) => {
    try {
      const { title, description, due_time, user_id, status } = req.body;
      if (!title || !description || !due_time || !user_id || !status) {
        res.status(400).json({ msg: "Bad parameter" });
        return;
      }
      createTodo(res, title, description, due_time, user_id, status);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.put("/todos/:id", auth, (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, due_time, status } = req.body;
      if (
        !id ||
        !title ||
        !description ||
        !due_time ||
        !status ||
        parseInt(id, 10).toString() !== id
      ) {
        res.status(400).json({ msg: "Bad parameter" });
        return;
      }
      updateTodoById(res, title, description, due_time, status, id);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.delete("/todos/:id", auth, (req, res) => {
    try {
      const { id } = req.params;
      if (parseInt(id, 10).toString() !== id) {
        res.status(400).json({ msg: "Bad parameter" });
        return;
      }
      deleteTodoById(res, req.params.id);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });
};
