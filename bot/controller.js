const fs = require("fs");

function getRules(_, res) {
  try {
    const data = JSON.parse(fs.readFileSync(`./bot/data/rules.json`, "utf-8"));
    res.status(200).send({ data });
  } catch {
    res.status(404).send({ Status: "No file found." });
  }
}

function addRules(req, res) {
  try {
    const data = JSON.parse(fs.readFileSync("./bot/data/rules.json", "utf-8"));
    Object.entries(req.body.rules).forEach(([k, v]) => {
      data[k] = v;
    });
    fs.writeFileSync("./bot/data/rules.json", JSON.stringify(data));
    res.status(200).send();
  } catch (e) {
    res.status(500).send({ Status: e });
  }
}

module.exports = {
  getRules,
  addRules,
};
