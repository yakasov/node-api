const fs = require("fs");
const mysql = require("mysql2/promise");

const conn = mysql.createConnection({
  user: "node",
  host: "localhost",
  database: "data",
});

async function testConnection(req, res) {
  try {
    const response = await getTables();
    await transferCache();

    res.status(200).send({ response });
  } catch (e) {
    res.status(500).send({ Status: e.message });
  }
}

async function getTables() {
  const [fields] = await (await conn).execute("SHOW TABLES");
  return fields.map((e) => e.Tables_in_data);
}

async function createTableIfNotExists(id) {
  if ((await getTables()).includes(`${id}`)) {
    return;
  }

  await (
    await conn
  ).execute(
    "CREATE TABLE `" +
      id +
      "` (`id` VARCHAR(255) NOT NULL, `owned` TINYINT(0), `set` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`))"
  );
}

async function transferCache(req, res) {
  function f(bool) {
    if (bool) {
      return 1;
    }
    return 0;
  }
  const cache = JSON.parse(
    fs.readFileSync(`../bot-rewrite-3-js/resources/mtg/mtgCache.json`, "utf-8")
  );
  const cn = await conn;

  Object.keys(cache).forEach((set) => {
    Object.entries(cache[set]).forEach(async ([k, c]) => {
      const query = `INSERT INTO cache VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        c.canBeFoil ? 1 : 0,
        c.colours.join(","),
        c.flavour_text ? c.flavour_text.replace(/'/g, "''").replace(/\n/g, "\\n") : "",
        c.foil ? 1 : 0,
        c.frameEffects && c.frameEffects.length ? c.frameEffects.join(",") : "",
        c.id,
        c.image,
        c.keywords.join(","),
        c.legal ? 1 : 0,
        c.local ? 1 : 0,
        c.mana_cost ? 1 : 0,
        c.name,
        k,
        c.oracle_text ? c.oracle_text.replace(/'/g, "''").replace(/\n/g, "\\n") : "",
        c.power,
        c.price || 0,
        c.price_foil || 0,
        c.rarity,
        c.set,
        c.set_name,
        c.toughness,
        c.type_line,
        c.url,
      ];
      await cn.execute(query, values);
    });
  });
}

module.exports = {
  testConnection,
};
