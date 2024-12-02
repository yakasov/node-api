const mysql = require("mysql2/promise");

const conn = mysql.createConnection({
  user: "node",
  host: "localhost",
  database: "data",
});

async function getCache(req, res) {
  const cn = await conn;
  const [results, ] = await cn.query("\
      SELECT image, flavour_text, oracle_text, name, number, id, `set`\
      FROM cache\
    ");

  res.status(200).send({ results });
}

async function getCards(req, res) {
  res.status(413).send({});
}

async function saveCards(req, res) {
  const user = req.body.user;
  const newCards = req.body.cards;

  const cn = await conn;
  await cn.execute(
    "CREATE TABLE IF NOT EXISTS `" +
    user +
      "` (`id` VARCHAR(255) NOT NULL, `owned` TINYINT(0), `set` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`))"
  );

  console.log(newCards);

  for (const card of newCards) {
    const query = "\
      INSERT INTO `" + user + "` (\
        id, owned, `set`\
      ) (\
       SELECT id, 1, ?\
       FROM cache\
       WHERE set = ? AND number = ?)\
    ";
    const values = [card.set, card.set, card.id];

    await cn.query(query, values);
  }

  res.status(200).send();
}

module.exports = {
  getCache,
  getCards,
  saveCards
};
