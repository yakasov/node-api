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

function saveCards(req, res) {
  const data = JSON.parse(
    fs.readFileSync(
      `../bot-rewrite-3-js/resources/mtg/mtgCards.json`,
      "utf-8"
    )
  );
  const cache = JSON.parse(
    fs.readFileSync(
      `../bot-rewrite-3-js/resources/mtg/mtgCache.json`,
      "utf-8"
    )
  );

  const user = req.body.user;
  const newCards = req.body.cards;
  const errors = [];

  Object.entries(newCards).forEach(([s, cs]) => {
    cs.forEach((c) => {
      try {
        const sLower = s.toLowerCase();
        const cId = cache[sLower][c].id;

        if (!data[user]) {
          data[user] = {};
        }

        if (!data[user][sLower]) {
          data[user][sLower] = [];
        }

        if (!data[user][sLower].includes(cId)) {
          data[user][sLower].push(cId);
        }
      } catch (e) {
        errors.push({ s, c, e: e.message })
      }
    })
  })

  res.status(200).send({ data, errors });
}

module.exports = {
  getCards,
  getCache,
  saveCards
};
