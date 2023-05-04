/* eslint-disable camelcase */
const db = require("../../config/db");

exports.viewAllTodos = function viewAllTodos(res) {
  db.query("SELECT * FROM todo", (err, results) => {
    if (err) {
      res.status(500).json({ msg: "Internal server error" });
      return;
    }
    const updatedResults = [];
    for (let i = 0; i < results.length; i += 1) {
      updatedResults[i] = results[i];
      updatedResults[i].id = updatedResults[i].id.toString();
      updatedResults[i].due_time = new Date(updatedResults[i].due_time)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }
    res.status(200).json(updatedResults);
  });
};

exports.viewTodoById = function viewTodoById(res, id) {
  db.query("SELECT * FROM todo WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ msg: "Internal server error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ msg: "Not found" });
      return;
    }
    const updatedResults = { ...results[0] };
    updatedResults.id = updatedResults.id.toString();
    updatedResults.user_id = updatedResults.user_id.toString();
    updatedResults.created_at = new Date(updatedResults.created_at)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    updatedResults.due_time = new Date(updatedResults.due_time)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    res.status(200).json(updatedResults);
  });
};

exports.createTodo = function createTodo(
  res,
  title,
  description,
  due_time,
  user_id,
  status
) {
  db.execute("SELECT id FROM user WHERE id = ?", [user_id], (err, results) => {
    if (err) {
      res.status(500).json({ msg: "Internal server error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ msg: "Not found" });
      return;
    }
    db.execute(
      "INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)",
      [title, description, due_time, user_id, status],
      (err2, results2) => {
        if (err2) {
          res.status(500).json({ msg: "Internal server error" });
          return;
        }
        const id = results2.insertId;
        if (id) {
          db.execute(
            "SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE id = ?",
            [id],
            (err3, results3) => {
              if (err3) {
                res.status(500).json({ msg: "Internal server error" });
                return;
              }
              if (results3.length === 0) {
                res.status(404).json({ msg: "Not found" });
                return;
              }
              const updatedResults = { ...results3[0] };
              updatedResults.id = updatedResults.id.toString();
              updatedResults.user_id = updatedResults.user_id.toString();
              updatedResults.created_at = new Date(updatedResults.created_at)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              updatedResults.due_time = new Date(updatedResults.due_time)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              res.status(200).json(updatedResults);
            }
          );
        }
      }
    );
  });
};

exports.updateTodoById = function updateTodoById(
  res,
  title,
  description,
  due_time,
  status,
  id
) {
  db.execute(
    "UPDATE `todo` SET title = ?, description = ?, due_time = ?, status = ? WHERE id = ?",
    [title, description, due_time, status, id],
    () => {
      db.execute(
        "SELECT title, description, due_time, user_id, status FROM todo WHERE id = ?",
        [id],
        (err, results) => {
          if (err) {
            res.status(500).json({ msg: "Internal server error" });
            return;
          }
          if (results.length === 0) {
            res.status(404).json({ msg: "Not found" });
            return;
          }
          const updatedResults = { ...results[0] };
          updatedResults.user_id = updatedResults.user_id.toString();
          updatedResults.due_time = new Date(updatedResults.due_time)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          res.status(200).json(updatedResults);
        }
      );
    }
  );
};

exports.deleteTodoById = function deleteTodoById(res, id) {
  db.execute("DELETE FROM todo WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ msg: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ msg: "Not found" });
      return;
    }
    res.status(200).json({ msg: `Successfully deleted record number: ${id}` });
  });
};
