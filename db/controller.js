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

module.exports = {
  testConnection,
};
