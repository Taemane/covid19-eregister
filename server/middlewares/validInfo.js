// Check whether email is valid or not
module.exports = (req, res, next) => {
  const { user_email, user_password } = req.body;

  function validateEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/auth/login") {
    if (![user_email, user_password].every(Boolean)) {
      return res.status(401).json({
        message: "Missing credentials",
      });
    } else if (!validateEmail(user_email)) {
      return res.status(401).json({
        message: "Invalid Email",
      });
    }
  }

  next();
};
