const express = require("express");
const cors = require("cors");
const https = require("https");
const mecRoutes = require("./mec/routes");

const privateKey  = fs.readFileSync('./sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('./sslcert/server.crt', 'utf8');
const options = { cert: certificate, key: privateKey }

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/status", (req, res) => {
  res.send({ Status: "Running" });
});
app.use("/mec", mecRoutes);

app.options("*", cors());
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);

const server = https.createServer(options, app);
server.listen(PORT, () => {
  console.log(`HTTPS listening on ${PORT}.`)
})