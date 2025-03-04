const fs = require("fs");
const mysql = require("mysql2/promise");

function getCn() {
  return mysql.createConnection({
    user: "node",
    host: "localhost",
    database: "data",
  });
}

async function testConnection(req, res) {
  try {
    const response = await getTables();

    res.status(200).send({ response });
  } catch (e) {
    res.status(500).send({ Status: e.message });
  }
}

async function getTables() {
  const [fields] = await (await getCn()).execute("SHOW TABLES");
  return fields.map((e) => e.Tables_in_data);
}

async function createTableIfNotExists(id) {
  if ((await getTables()).includes(`${id}`)) {
    return;
  }

  await (
    await getCn()
  ).execute(
    "CREATE TABLE `" +
      id +
      "` (`id` VARCHAR(255) NOT NULL, `owned` TINYINT(0), `set` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`))"
  );
}

async function transferCache(req, res) {
  const cache = JSON.parse(
    fs.readFileSync(`../bot-rewrite-3-js/resources/mtg/mtgCache.json`, "utf-8")
  );
  const cn = await getCn();

  Object.keys(cache).forEach((set) => {
    Object.entries(cache[set]).forEach(async ([k, c]) => {
      const query = "\
        INSERT IGNORE INTO `cache` (\
          can_be_foil, colours, flavour_text, foil, frame_effects,\
          id, image, keywords, legal, local,\
          mana_cost, `name`, number, oracle_text, power, price,\
          price_foil, rarity, `set`, set_name, toughness,\
          type_line, url\
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\
      ";
      const values = [
        c.canBeFoil ? 1 : 0,
        c.colours ? c.colours.join(",") : "",
        c.flavour_text || null,
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
        c.oracle_text || null,
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
        console.log(`Set: ${c.set}, number: ${k}`);
      } catch (err) {
        console.error("Error executing query:", err);
        console.error("Query:", query);
        console.error("Values:", values);
      }
    });
  });

  cn.destroy();
  res.status(200).send();
}

module.exports = {
  transferCache,
  testConnection,
};
