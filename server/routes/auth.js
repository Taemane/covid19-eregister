const router = require("express").Router();
const db = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middlewares/validInfo");
const authorization = require("../middlewares/authorization");

router.post("/login", validInfo, async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    const user = await db.query(
      "SELECT * FROM admin_users WHERE user_email = $1",
      [user_email]
    );

    if (user.rows.length === 0) {
      res.status(401).json({
        message: "Password or Email is incorrect",
      });
    }
    // Checking if password matches
    // Pass user role to the generator
    if (user_password === user.rows[0].user_password) {
      let user_role = user.rows[0].user_role;
      const token = jwtGenerator(user.rows[0].user_id, user.rows[0].user_role);

      return res.status(200).json({
        token,
        user_role,
      });
    } else {
      return res.status(401).json({
        message: "Password or Email is incorrect",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// verifying Token
router.get("/verify", authorization, async (req, res) => {
  try {
    res.status(200).json({
      verification: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
