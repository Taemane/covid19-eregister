const jwt = require("jsonwebtoken");
require("dotenv").config();

// pass user id and user role
function jwtGenerator(user_id, user_role) {
  const payload = {
    user_id,
    user_role,
  };
  return jwt.sign(payload, process.env.jwtsecret, { expiresIn: "1h" });
}

module.exports = jwtGenerator;
