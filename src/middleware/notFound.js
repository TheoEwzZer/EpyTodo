const db = require("../config/db");

module.exports = (req, res, next) => {
  const { id } = req.params;

  if (!id || parseInt(id, 10).toString() !== id) {
    res.status(500).json({ msg: "Internal server error" });
    return;
  }

  db.execute("SELECT * FROM `todo` WHERE id = ?", [id], (err, results) => {
    if (results.length > 0) {
      next();
    } else {
      res.status(404).json({ msg: "Not found" });
    }
  });
};
