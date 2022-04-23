const router = require("express").Router();
const db = require("../db");
const authorization = require("../middlewares/authorization");

// Getting Master Data (Departments,....)
router.get("/", authorization, async (req, res) => {
  try {
    const { user_role } = req.body;
    // console.log(user_role);

    const allDepts = await db.query("SELECT * FROM department");

    if (allDepts.rows.length > 0) {
      return res.status(200).json({
        status: "success",
        results: allDepts.rows.length,
        data: allDepts.rows,
      });
    } else {
      return res.status(404).json({ message: "No Department records found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
