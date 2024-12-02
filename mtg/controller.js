const mysql = require("mysql2/promise");

const conn = mysql.createConnection({
  user: "node",
  host: "localhost",
  database: "data",
});

async function saveCards(req, res) {
  const user = req.body.user;
  const newCards = req.body.cards;

  const cn = await conn;
  await cn.execute(
    "CREATE TABLE `" +
    user +
      "` (`id` VARCHAR(255) NOT NULL, `owned` TINYINT(0), `set` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`))"
  );

  for (const card of newCards) {
    const query = "\
      INSERT INTO `" + user + "` (\
        id, owned, `set`\
      ) (\
       SELECT id, 1, '?'\
       FROM cache\
       WHERE id = ?)\
    ";
    const values = [card.set, card.id];

    await cn.query(query, values);
  }

  res.status(200).send();
}

module.exports = {
  getCards,
  getCache,
  saveCards
};
