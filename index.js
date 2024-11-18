const express = require("express");
const cors = require("cors");
const corser = require("corser");
const http = require("http");
const https = require("https");
const fs = require("fs");
const serveIndex = require("serve-index");
const mecRoutes = require("./mec/routes");

const privateKey  = fs.readFileSync('./sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('./sslcert/server.pem', 'utf8');
const options = { cert: certificate, key: privateKey }

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/.well-known", express.static(".well-known"), serveIndex(".well-known"))

app.get("/status", (req, res) => {
  res.send({ Status: "Running" });
});
app.use("/mec", mecRoutes);
app.use(corser.create())

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

httpServer.listen(PORT - 1, () => {
  console.log(`HTTP listening on ${PORT - 1}.`)
})
httpsServer.listen(PORT, () => {
  console.log(`HTTPS listening on ${PORT}.`)
})