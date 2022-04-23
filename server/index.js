require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

//ROUTES
//Admin rights endpoints
app.use("/api/v1/auth", require("./routes/auth"));

app.use("/api/v1/employees", require("./routes/employees"));
app.use("/api/v1/entry-list", require("./routes/records"));
app.use("/api/v1/departments", require("./routes/master-data"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
