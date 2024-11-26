const mysql = require("mysql");

const connection = mysql.createConnection({
  user: "node",
  host: "localhost",
  database: "data"
})

async function getConnection(req, res) {
  try {
    let response = null;

    connection.connect();
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) throw error;
      response = 'The solution is: ', results[0].solution;
    });
    connection.end();

    res.status(200).send({ response });
  } catch (e) {
    res.status(500).send({ Status: e.message });
  }
}

module.exports = {
  getConnection,
};
