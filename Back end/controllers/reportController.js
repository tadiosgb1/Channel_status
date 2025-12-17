const GenerateQuery = require("../query");
const oracledb = require("oracledb");
const mysql = require("mysql2/promise");
const { getDate, formatJsonData } = require("../utils");

let oracleConn = null;
let mysqlConn = null;

async function connectDatabases() {

//console.log("user and password and connectString",process.env.ORACLE_USER,process.env.ORACLE_PASS,process.env.ORACLE_CONN);

  try {
    if (!oracleConn) {
      oracleConn = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: 'Tade#ussdprod1234',
        connectString: process.env.ORACLE_CONN,
      });
    }

    if (!mysqlConn) {
      mysqlConn = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: "Tade@ussdprod123",
        database: process.env.MYSQL_DB,
      });
    }
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw new Error("No database connection available");
  }
}

module.exports = {
  renderReport: async (req, res) => {
    try {
      await connectDatabases();

      const data = await fetchData();

      
      res.json({
        message: "Report fetched successfully",
        data: formatJsonData(data.data),
        individualExecutionTime: data.individualExecutionTime,
        ExecutionTime: data.ExecutionTime,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch report", details: err.message });
    }
  },

  renderConfirm: async (req, res) => {
    try {
      await connectDatabases();

      const data = await fetchData(true);
      res.json({
        message: "Confirmation report fetched successfully",
        data: data.data,
        individualExecutionTime: data.individualExecutionTime,
        ExecutionTime: data.ExecutionTime,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch confirmation report", details: err.message });
    }
  },

  fetchDataAPI: async (req, res) => {
    try {
      await connectDatabases();

      const data = await fetchData();
      res.json(formatJsonData(data.data));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch data", details: err.message });
    }
  },

  disconnect: async (req, res) => {
    try {
      if (oracleConn) await oracleConn.close();
      if (mysqlConn) await mysqlConn.end();

      oracleConn = null;
      mysqlConn = null;

      res.json({ message: "Disconnected" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to disconnect" });
    }
  },
};

// Internal function to fetch data
async function fetchData(check = false) {
  const results = {};
  const executionTimes = {};
  const queries = GenerateQuery(getDate(), check);

  const overallStartTime = Date.now();

  await Promise.all(
    Object.entries(queries).map(async ([key, querySet]) => {
      if (!querySet) return;

      const startTime = Date.now();

      await Promise.all(
        Object.entries(querySet).map(async ([subKey, subQuery]) => {
          if (key === "mysql" && mysqlConn) {
            const [rows] = await mysqlConn.query(subQuery);
            results[subKey] = check ? rows : rows.length ? Object.values(rows[0])[0] : null;
          } else if (oracleConn) {
            const result = await oracleConn.execute(subQuery, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
            results[subKey] = check ? result.rows : result.rows.length ? Object.values(result.rows[0])[0] : null;
          }
        })
      );

      executionTimes[key] = ((Date.now() - startTime) / 1000).toFixed(4);
    })
  );

  return {
    data: results,
    individualExecutionTime: executionTimes,
    ExecutionTime: ((Date.now() - overallStartTime) / (1000 * 60)).toFixed(4),
  };
}
