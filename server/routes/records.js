const router = require("express").Router();
const db = require("../db");
const authorization = require("../middlewares/authorization");

//create a daily entry
router.post("/", authorization, async (req, res) => {
  try {
    const {
      names,
      cell_number,
      question_1,
      question_2,
      question_3,
      question_4,
      question_5,
      question_6,
      question_7,
      question_8,
      vaccinated,
      temperature,
      employee_id,
    } = req.body;
    const entryData = await db.query(
      "INSERT INTO daily_entry_table(names, cell_number, question_1, question_2, question_3, question_4, question_5, question_6, question_7, question_8, vaccinated, temperature, employee_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [
        names,
        cell_number,
        question_1,
        question_2,
        question_3,
        question_4,
        question_5,
        question_6,
        question_7,
        question_8,
        vaccinated,
        temperature,
        employee_id,
      ]
    );

    if (entryData.rows.length > 0) {
      res.status(200).json({
        status: "success",
        result: entryData.rows.length,
        data: entryData.rows[0],
      });
    } else {
      res.status(400).json({
        message: "Bad Request",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
// get all daily entry
router.get("/", authorization, async (req, res) => {
  try {
    const allEntries = await db.query("SELECT * FROM daily_entry_table");

    if (allEntries.rows.length > 0) {
      res.status(200).json({
        status: "success",
        results: allEntries.rows.length,
        data: allEntries.rows,
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});
// get all entries belonging to a person(guest or staff)
router.get("/:id", authorization, async (req, res) => {
  try {
    const _id = req.params.id;

    const entries = await db.query(
      "SELECT * FROM daily_entry_table WHERE cell_number = $1",
      [_id]
    );
    if (entries.rows.length > 0) {
      res.status(200).json({
        status: "success",
        results: entries.rows.length,
        data: entries.rows,
      });
    } else {
      res.status(404).json({
        message: "No record found",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
