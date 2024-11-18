const express = require("express");
const cors = require("cors");
const corser = require("corser");
const http = require("http");
const https = require("https");
const fs = require("fs");
const mecRoutes = require("./mec/routes");

const privateKey  = fs.readFileSync('./sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('./sslcert/server.pem', 'utf8');
const options = { cert: certificate, key: privateKey }

const app = express();
const HTTP_PORT = 80;
const HTTPS_PORT = 443;

app.use(express.json());
app.use(cors());

app.get("/status", (req, res) => {
  res.send({ Status: "Running" });
});
app.use("/mec/*", mecRoutes);
app.use(corser.create())

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
})

// Redirect all HTTP traffic to HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

http.createServer((req, res) => {
  const host = req.headers.host || 'jmcd.uk';
  const redirectTo = `https://${host}${req.url}`;
  res.writeHead(301, { Location: redirectTo });
  res.end();
}).listen(HTTP_PORT, () => {
  console.log(`HTTP listening on ${HTTP_PORT} and redirecting to HTTPS.`);
});
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS listening on ${HTTPS_PORT}.`)
})