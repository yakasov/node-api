const mysql = require("mysql2/promise");

const connection = mysql.createConnection({
  user: "node",
  host: "localhost",
  database: "data"
})

async function testConnection(req, res) {
  try {
    const response = (await connection).execute(
      "SELECT * FROM `data.test"
    )

    res.status(200).send({ response });
  } catch (e) {
    res.status(500).send({ Status: e.message });
  }
}

module.exports = {
  testConnection,
};
