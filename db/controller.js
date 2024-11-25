const pg = require("node-postgres");
const { Pool } = pg;

const pool = new Pool({
  user: "node",
  host: "localhost",
  port: 5432,
  database: "data"
})

async function getConnection(req, res) {
  try {
    const data = await pool.query('SELECT NOW()');
    res.status(200).send({ data });
  } catch (e) {
    res.status(500).send({ Status: e.message });
  }
}

module.exports = {
  getConnection,
};
