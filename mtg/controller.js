const fs = require("fs");
const mysql = require("mysql2/promise");

const runningImports = {};

function getCn() {
  return mysql.createConnection({
    user: "node",
    host: "localhost",
    database: "data",
  });
}

async function getImportStatus(req, res) {
  const importId = req.params.id;

  res.status(201).send({ status: runningImports[importId] })
}

async function getCache(req, res) {
  const cn = await getCn();
  const [results] = await cn.query(
    "\
      SELECT image, flavour_text, oracle_text, name, number, id, `set`\
      FROM cache\
    "
  );

  cn.destroy();
  res.status(200).send({ results });
}

async function getCards(req, res) {
  const cn = await getCn();
  const tables = (await getTables(cn)).filter((t) => t.length === 18);
  const cards = {};

  for (const table of tables) {
    const [results] = await cn.query("SELECT * FROM `" + table + "`");
    cards[table] = results;
  }

  cn.destroy();
  res.status(200).send({ cards });
}

async function getTables(cn) {
  const [fields] = await cn.execute("SHOW TABLES");
  return fields.map((e) => e.Tables_in_data);
}

async function saveCards(req, res) {
  const user = req.body.user;
  const newCards = req.body.cards;
  const importId = req.body.id;

  runningImports[importId] = true;

  const cn = await getCn();
  await cn.execute(
    "CREATE TABLE IF NOT EXISTS `" +
      user +
      "` (`id` VARCHAR(255) NOT NULL, `owned` TINYINT(0), `set` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`))"
  );

  res.status(200);

  for (const card of newCards) {
    const query =
      "\
      INSERT IGNORE INTO `" +
      user +
      "` (\
        id, owned, `set`\
      ) (\
       SELECT id, 1, ?\
       FROM cache\
       WHERE `set` = ? AND number = ?)\
    ";
    const values = [card.set.toLowerCase(), card.set, card.id];

    await cn.query(query, values);
  }

  cn.destroy();
  runningImports[importId] = false;
}

async function getImage(req, res) {
  const id = req.params.imageId;
  const image = fs.readFileSync(
    `../bot-rewrite-3-js/resources/mtg/images/${id}.jpg`,
    { encoding: "base64" }
  );

  res.status(200).send({ base64: image })
}

module.exports = {
  getCache,
  getCards,
  getImage,
  getImportStatus,
  saveCards,
};
