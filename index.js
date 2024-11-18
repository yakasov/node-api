const express = require("express");
const cors = require("cors");
const mecRoutes = require("./mec/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get("/status", (req, res) => {
  res.send({ Status: "Running" });
});
app.use("/mec", mecRoutes);

app.options("*", cors());
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);
