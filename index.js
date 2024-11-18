const express = require("express");
const cors = require("cors");
const corser = require("corser");
const https = require("https");
const fs = require("fs");
const mecRoutes = require("./mec/routes");

const privateKey  = fs.readFileSync('./sslcert/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('./sslcert/selfsigned.crt', 'utf8');
const options = { cert: certificate, key: privateKey }

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/status", (req, res) => {
  res.send({ Status: "Running" });
});
app.use("/mec", mecRoutes);
app.use(corser.create())

const server = https.createServer(options, app);
server.listen(PORT, () => {
  console.log(`HTTPS listening on ${PORT}.`)
})