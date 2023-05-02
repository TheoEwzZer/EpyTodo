/* eslint-disable camelcase */
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

exports.viewAllUsers = function viewAllUsers(res) {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) {
      res.status(500).json({ msg: "Internal server error" });
      return;
    }
    const updatedResults = { ...results[0] };
    updatedResults.id = updatedResults.id.toString();
    updatedResults.created_at = new Date(updatedResults.created_at)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    res.status(200).json(updatedResults);
  });
};

exports.viewAllUserTodos = function viewAllUserTodos(res, id) {
  db.query("SELECT * FROM todo WHERE user_id = ?", [id], (err, results) => {
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

exports.registerUser = function registerUser(
  res,
  email,
  password,
  name,
  firstname
) {
  db.execute(
    "INSERT INTO `user` (email, password, name, firstname) VALUES (?, ?, ?, ?)",
    [email, password, name, firstname],
    (err) => {
      if (err) {
        res.status(500).json({
          error: "Internal server error",
        });
        return;
      }
      const token = jwt.sign({ email, password }, process.env.SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    }
  );
};

exports.viewUserByEmail = function viewUserIdByEmail(res, email) {
  db.execute(
    "SELECT * FROM `user` WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ msg: "Not found" });
        return;
      }
      const updatedResults = { ...results[0] };
      updatedResults.id = updatedResults.id.toString();
      updatedResults.created_at = new Date(updatedResults.created_at)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      res.status(200).json(updatedResults);
    }
  );
};

exports.viewUserById = function viewUserEmailById(res, id) {
  db.execute("SELECT * FROM `user` WHERE id = ?", [id], (err, results) => {
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
    updatedResults.created_at = new Date(updatedResults.created_at)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    res.status(200).json(updatedResults);
  });
};

exports.deleteUserById = function deleteUserById(res, id) {
  db.execute("DELETE FROM `user` WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ msg: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ msg: "Not found" });
      return;
    }
    res.status(204).json({ msg: `Successfully deleted record number: ${id}` });
  });
};

exports.updateUserById = function updateUserById(
  res,
  id,
  email,
  password,
  name,
  firstname
) {
  db.execute(
    "UPDATE `user` SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?",
    [email, password, name, firstname, id],
    () => {
      db.execute(
        "SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?",
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
          updatedResults.id = updatedResults.id.toString();
          updatedResults.created_at = new Date(updatedResults.created_at)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          res.status(200).json(updatedResults);
        }
      );
    }
  );
};

exports.checkAccountMail = function checkAccountMail(res, email, callback) {
  db.execute(
    "SELECT * FROM `user` WHERE email = ?",
    [email],
    (err, results) => {
      if (results.length > 0) {
        callback(84);
      } else {
        callback(0);
      }
    }
  );
};

exports.getMailAccount = function getMailAccount(
  res,
  email,
  password,
  bcrypt,
  callback
) {
  db.execute(
    "SELECT password, id FROM `user` WHERE email = ?",
    [email],
    (err, results) => {
      if (results.length > 0) {
        const id2 = results[0].id;
        const password2 = results[0].password;
        if (!bcrypt.compareSync(password, password2)) {
          callback(84);
        } else {
          const token = jwt.sign({ email, id: id2 }, process.env.SECRET, {
            expiresIn: "1h",
          });
          res.json({ token });
          callback(0);
        }
      } else {
        callback(84);
      }
    }
  );
};
