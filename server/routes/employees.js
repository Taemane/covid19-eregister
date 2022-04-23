const router = require("express").Router();
const db = require("../db");
const authorization = require("../middlewares/authorization");

router.post("/", authorization, async (req, res) => {
  try {
    const { names, cell_number, dept_id, vaccinated } = req.body;

    const newEmployee = await db.query(
      "INSERT INTO employees(names, cell_number, dept_id, vaccinated) VALUES ($1, $2, $3, $4) RETURNING *",
      [names, cell_number, dept_id, vaccinated]
    );

    if (newEmployee.rows.length > 0) {
      res.status(200).json({
        status: "success",
        results: newEmployee.rows.length,
        data: newEmployee.rows[0],
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
//get all employee
router.get("/", authorization, async (req, res) => {
  try {
    const allEmployees = await db.query("SELECT * FROM employees");
    if (allEmployees.rows.length > 0) {
      res.status(200).json({
        status: "success",
        results: allEmployees.rows.length,
        data: allEmployees.rows,
      });
    } else {
      res.status(404).json({
        message: "No employee record found",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
//get 1 employee
router.get("/:id", authorization, async (req, res) => {
  try {
    const emp_id = req.params.id;

    const employee = await db.query(
      "SELECT * FROM employees WHERE employee_id = $1",
      [emp_id]
    );

    if (employee.rows.length > 0) {
      res.status(200).json({
        status: "success",
        results: employee.rows.length,
        data: employee.rows[0],
      });
    } else {
      res.status(404).json({
        message: "Employee not found",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
//delete employee
router.delete("/:id", authorization, async (req, res) => {
  try {
    const emp_id = req.params.id;

    const employee = db.query("DELETE FROM employees WHERE employee_id = $1", [
      emp_id,
    ]);

    res.status(204).json({
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Internal Sever Error",
    });
  }
});
//edit employee
router.put("/:id", authorization, async (req, res) => {
  try {
    const emp_id = req.params.id;
    const { names, cell_number, dept_id, vaccinated } = req.body;

    const editedEmployee = await db.query(
      "UPDATE employees SET names = $1, cell_number = $2, dept_id = $3, vaccinated = $4 WHERE employee_id = $5 RETURNING *",
      [names, cell_number, dept_id, vaccinated, emp_id]
    );

    if (editedEmployee.rows.length > 0) {
      res.status(200).json({
        status: "success",
        results: editedEmployee.rows.length,
        data: editedEmployee.rows[0],
      });
    } else {
      res.status(400).json({ message: "Bad Request" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
