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
const PORT = 3000;

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

httpServer.listen(PORT - 1, () => {
  console.log(`HTTP listening on ${PORT - 1}.`)
})
httpsServer.listen(PORT, () => {
  console.log(`HTTPS listening on ${PORT}.`)
})