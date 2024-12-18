const fs = require("fs");

function getCards(req, res) {
  try {
    const data = JSON.parse(
      fs.readFileSync(
        `../bot-rewrite-3-js/resources/mtg/mtgCards.json`,
        "utf-8"
      )
    );
    res.status(200).send({ data });
  } catch {
    res.status(404).send({ Status: "No file found." });
  }
}

function getCache(req, res) {
  try {
    const data = JSON.parse(
      fs.readFileSync(
        `../bot-rewrite-3-js/resources/mtg/mtgCache.json`,
        "utf-8"
      )
    );
    res.status(200).send({ data });
  } catch {
    res.status(404).send({ Status: "No file found." });
  }
}

module.exports = {
  getCards,
  getCache
};
