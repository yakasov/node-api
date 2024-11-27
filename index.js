const express = require("express");
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");
const dbRoutes = require("./db/routes");
const mecRoutes = require("./mec/routes");
const mtgRoutes = require("./mtg/routes");

const privateKey = fs.readFileSync("./sslcert/key.pem", "utf8");
const certificate = fs.readFileSync("./sslcert/signedcrt.pem", "utf8");
const options = { cert: certificate, key: privateKey };

const app = express();
const HTTP_PORT = 80;
const HTTPS_PORT = 443;

app.use(express.json());
app.use(
  cors({
    origin: ["https://yakasov.github.io", "http://localhost:5173"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

app.get("/status", (req, res) => {
  res.send({ Status: "Running" });
});
app.use("/db", dbRoutes);
app.use("/mec", mecRoutes);
app.use("/mtg", mtgRoutes);

const httpsServer = https.createServer(options, app);

// Redirect all HTTP traffic to HTTPS
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

http
  .createServer((req, res) => {
    const host = req.headers.host || "jmcd.uk";
    const redirectTo = `https://${host}${req.url}`;
    res.writeHead(301, { Location: redirectTo });
    res.end();
  })
  .listen(HTTP_PORT, () => {
    console.log(`HTTP listening on ${HTTP_PORT} and redirecting to HTTPS.`);
  });
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS listening on ${HTTPS_PORT}.`);
});
