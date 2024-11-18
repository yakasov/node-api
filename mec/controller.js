const fs = require("fs");

function getLeaderboard(req, res) {
  try {
    const data = JSON.parse(
      fs.readFileSync(`./mec/data/${req.params.player}.json`, "utf-8")
    );
    res.status(200).send({ data });
  } catch {
    res.status(404).send({ Status: "No file found." });
  }
}

function setLeaderboard(req, res) {
  fs.writeFileSync(
    `./mec/data/${req.body.player}.json`,
    JSON.stringify(req.body.times)
  );
  res.status(200).send({ Status: `Saved data for ${req.body.player}` });
}

module.exports = {
  getLeaderboard,
  setLeaderboard,
};
