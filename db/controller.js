const fs = require("fs");
const mysql = require("mysql2/promise");

const conn = mysql.createConnection({
  user: "node",
  host: "localhost",
  database: "data"
})

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
  const [fields, ] = await (await conn).execute("SHOW TABLES");
  return fields.map((e) => e.Tables_in_data);
}

async function createTableIfNotExists(id) {
  if ((await getTables()).includes(`${id}`)) {
    return;
  }

  await (await conn).execute("CREATE TABLE `" + id +"` (`id` VARCHAR(255) NOT NULL, `owned` TINYINT(0), `set` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`))")
}

async function transferCache(req, res) {
  function f(bool) {
    if (bool) {
      return 1;
    }
    return 0;
  }
  const cache = JSON.parse(
    fs.readFileSync(
      `../bot-rewrite-3-js/resources/mtg/mtgCache.json`,
      "utf-8"
    )
  );
  const cn = await conn;

  Object.keys(cache).forEach((set) => {
    Object.entries(cache[set]).forEach(async ([k, c]) => {
      const query = `INSERT INTO cache VALUES (${f(c.canBeFoil)}, '${c.colours.join(",")}', '${JSON.stringify(c.flavour_text ?? "")}', ${f(c.foil)}, '${c.frameEffects && c.frameEffects.length ? c.frameEffects.join(",") : ""}', '${c.id}', '${c.image}', '${c.keywords.join(",")}', ${c.legal}, ${f(c.local)}, ${f(c.mana_cost)}, '${c.name}', '${k}', '${JSON.stringify(c.oracle_text)}', '${c.power}', ${c.price}, ${c.price_foil}, '${c.rarity}', '${c.set}', '${c.set_name}', '${c.toughness}', '${c.type_line}', '${c.url}')`;
      await cn.execute(query);
      return;
    })
  })
}

module.exports = {
  testConnection,
};
