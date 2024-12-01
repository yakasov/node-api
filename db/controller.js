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

  const sanitizeString = (str) =>
    str
      ? str
          .replace(/'/g, "''")
          .replace(/\n/g, "\\n")
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      : null;

  const cache = JSON.parse(
    fs.readFileSync(`../bot-rewrite-3-js/resources/mtg/mtgCache.json`, "utf-8")
  );
  const cn = await conn;

  Object.keys(cache).forEach((set) => {
    Object.entries(cache[set]).forEach(async ([k, c]) => {
      const query = `
        INSERT INTO cache (
          can_be_foil, colours, flavour_text, foil, frame_effects,
          id, image, keywords, legal, local,
          mana_cost, name, oracle_text, power, price,
          price_foil, rarity, set, set_name, toughness,
          type_line, url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        c.canBeFoil ? 1 : 0,
        c.colours ? c.colours.join(",") : "",
        sanitizeString(c.flavour_text),
        c.foil ? 1 : 0,
        c.frameEffects && c.frameEffects.length
          ? c.frameEffects.join(",")
          : null,
        c.id || null,
        c.image || null,
        c.keywords ? c.keywords.join(",") : "",
        c.legal ? 1 : 0,
        c.local ? 1 : 0,
        c.mana_cost ? c.mana_cost : null,
        c.name || null,
        k || null,
        sanitizeString(c.oracle_text),
        c.power || null,
        c.price || 0,
        c.price_foil || 0,
        c.rarity || null,
        c.set || null,
        c.set_name || null,
        c.toughness || null,
        c.type_line || null,
        c.url || null,
      ];

      try {
        await cn.execute(query, values);
      } catch (err) {
        console.error("Error executing query:", err);
        console.error("Query:", query);
        console.error("Values:", values);
      }
    });
  });
}

module.exports = {
  testConnection,
};
