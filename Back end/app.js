const express = require("express");
const oracledb = require("oracledb");
const mysql = require("mysql2/promise");
const GenerateQuery = require("./query");
const path = require("path");
const bodyParser = require("body-parser");
const { getDate, isConnectionAlive, formatJsonData } = require("./utils");

const app = express();
const PORT = 1000;
app.use(express.json());

const dbConfig = {
  // connectString: "10.57.23.30/wfcdrstd",
  connectString: "10.57.40.34/wfcprod",
};
let connection;
let mysql_connection;
const mysqlDBConfig = {
  host: "10.57.40.196",
  port: "3397",
  database: "ussd",
};

let authenticated = false;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, "public")));
// const io = socketIo(server);
// Define a route to render the table
app.get("/report", async (req, res) => {
  // const data = await fetchData()
  if (authenticated && isConnectionAlive(connection)) {
    try {
      const data = await fetchData();
      // io.on("connection", (socket) => {
      //   console.log("Client connected");

      //   // Send a notification after 5 seconds
      //   setTimeout(() => {
      //     socket.emit("play-audio", { message: "Notification!" });
      //   }, 5000);
      // });
      res.render("table", {
        message: "Report generated successfully!",
        data: formatJsonData(data.data),
        individualExecutionTime: data.individualExecutionTime,
        ExecutionTime: data.ExecutionTime,
      });
    } catch (error) {
      console.error(error);
      res.render("index", { message: "Failed to generate the report." });
    }
  } else {
    res.redirect("login");
  }
});
app.get("/confirm", async (req, res) => {
  if (authenticated && isConnectionAlive(connection)) {
    try {
      const data = await fetchData(true);
      res.render("check", {
        message: "Report generated successfully!",
        data: data.data,
        individualExecutionTime: data.individualExecutionTime,
        ExecutionTime: data.ExecutionTime,
      });
    } catch (error) {
      console.error(error);
      res.render("index", { message: "Failed to generate the report." });
    }
  } else {
    res.redirect("login");
  }
});

app.get("/", (req, res) => {
  if (authenticated && isConnectionAlive(connection)) {
    res.render("index"); // Render the index.ejs file
  } else {
    res.redirect("login");
  }
});

// API Route
app.get("/fetch", async (req, res) => {
  let data = await fetchData();
  data = formatJsonData(data.data);
  res.json(data);
});
app.get("/disconnect", async (req, res) => {
  if (connection) {
    await connection.close();
    authenticated = false;
  }
  res.redirect("/login");
});

app.post("/logintest", async (req, res) => {
  try {
    const user = req.body.user || null;
    const password = req.body.password || null;
    if (!user || !password)
      res
        .status(401)
        .json({ status: 1, message: "Username and password is required." });
    dbConfig.user = user;
    dbConfig.password = password;

    console.log("Attempting to connect to the database...");
    connection = await oracledb.getConnection(dbConfig);
    console.log("\nDatabase connection successful!");

    res.json({ status: 0, message: "Database connection successful!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 1, message: "Internal Server Error." });
  }
});

app.get("/login", async (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  try {
    const oracle_user = req.body.oracle_user || null;
    const oracle_password = req.body.oracle_password || null;
    const mysql_user = req.body.mysql_user || null;
    const mysql_password = req.body.mysql_password || null;
    if (!oracle_user || !oracle_password)
      return res.render("login", {
        error: "Username and password is required.",
      });
    dbConfig.user = oracle_user;
    dbConfig.password = oracle_password;
    if (mysql_user) {
      mysqlDBConfig.user = mysql_user;
      mysqlDBConfig.password = mysql_password;

      // Wrap the connection logic in a Promise
      mysql_connection = await mysql.createConnection(mysqlDBConfig);
      console.log(
        "Connected to MYSQL database as ID:",
        mysql_connection.threadId
      );
    }

    console.log("Attempting to connect to the oracle database...");
    connection = await oracledb.getConnection(dbConfig);
    authenticated = true;
    console.log("\nOracle Database connection successful!");

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("login", {
      error: error.message || "Internal Server Error.",
    }); // Render error message on failure
  }
});
async function fetchData(check = false) {
  let status = false;
  const results = {}; // Flat structure
  const executionTimes = {};
  console.log("Fetching Date: " + getDate());

  let connection_external;
  let connection_ussd;
  let connection_ussd_sum;
  let connection_ussd_sum2;

  const queries = GenerateQuery(getDate(), check);

  try {
    // Initialize connections if needed
    if (queries.external)
      connection_external = await oracledb.getConnection(dbConfig);
    if (queries.count) connection_ussd = await oracledb.getConnection(dbConfig);
    if (queries.sum)
      connection_ussd_sum = await oracledb.getConnection(dbConfig);
    if (queries.sum2)
      connection_ussd_sum2 = await oracledb.getConnection(dbConfig);

    if (connection) status = true;

    const overallStartTime = Date.now(); // Start overall timer
  

    if (status) {
      console.log("\nAttempting to Fetch...");

      const queryPromises = Object.entries(queries).map(
        async ([key, querySet]) => {
          const startTime = Date.now();

          try {
            if (
              (key === "other" && querySet !== null) ||
              (key === "check" && querySet !== null)
            ) {
              // Execute "other" queries in parallel
              const subQueryPromises = Object.entries(querySet).map(
                async ([subKey, subQuery]) => {
                  console.log(`Executing ${subKey}`);
                  const result = await connection.execute(subQuery, [], {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                  });
                  results[subKey] = check
                    ? result.rows
                    : result.rows.length > 0
                    ? Object.values(result.rows[0])[0]
                    : null;
                  console.log(`${subKey}: ${results[subKey]}`);
                }
              );

              await Promise.all(subQueryPromises);
            } 
      else if (key === "datecheck" && querySet !== null) {
          const subQueryPromises = Object.entries(querySet).map(
            async ([subKey, subQuery]) => {
              console.log(`Executing ${subKey}`);

              const result = await connection.execute(subQuery, [], {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
              });

              let value =
                result.rows.length > 0 ? Object.values(result.rows[0])[0] : null;

              // Format datecheck with AM/PM
              if (subKey === "datecheck" && value) {
                const date = new Date(value);
                const hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, "0");
                const ampm = hours >= 12 ? "PM" : "AM";
                const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
                results.datecheck = `${date.toDateString()} ${formattedHour}:${minutes} ${ampm}`;
              } else {
                results[subKey] = value;
              }

              console.log(`${subKey}: ${results[subKey]}`);
            }
          );

          await Promise.all(subQueryPromises);
        }

            
            else if (key === "external" && querySet !== null) {
              // Execute "external" queries in parallel
              const subQueryPromises = Object.entries(querySet).map(
                async ([subKey, subQuery]) => {
                  console.log(`Executing ${subKey}`);
                  const result = await connection_external.execute(
                    subQuery,
                    [],
                    {
                      outFormat: oracledb.OUT_FORMAT_OBJECT,
                    }
                  );
                  results[subKey] = check
                    ? result.rows
                    : result.rows.length > 0
                    ? Object.values(result.rows[0])[0]
                    : null;
                  console.log(`${subKey}: ${results[subKey]}`);
                }
              );

              await Promise.all(subQueryPromises);
            } else if (key === "count" && querySet !== null) {
              const subQueryPromises = Object.entries(querySet).map(
                async ([subKey, subQuery]) => {
                  console.log(`Executing ${subKey}`);
                  const result = await connection_ussd.execute(subQuery, [], {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                  });
                  results[subKey] = check
                    ? result.rows
                    : result.rows.length > 0
                    ? Object.values(result.rows[0])[0]
                    : null;
                  console.log(`${subKey}: ${results[subKey]}`);
                }
              );

              await Promise.all(subQueryPromises);
            } else if (key === "sum") {
              const subQueryPromises = Object.entries(querySet).map(
                async ([subKey, subQuery]) => {
                  console.log(`Executing ${subKey}`);
                  const result = await connection_ussd_sum.execute(
                    subQuery,
                    [],
                    {
                      outFormat: oracledb.OUT_FORMAT_OBJECT,
                    }
                  );
                  results[subKey] = check
                    ? result.rows
                    : result.rows.length > 0
                    ? Object.values(result.rows[0])[0]
                    : null;
                  console.log(`${subKey}: ${results[subKey]}`);
                }
              );

              await Promise.all(subQueryPromises);
            } else if (key === "sum2") {
              const subQueryPromises = Object.entries(querySet).map(
                async ([subKey, subQuery]) => {
                  console.log(`Executing ${subKey}`);
                  const result = await connection_ussd_sum2.execute(
                    subQuery,
                    [],
                    {
                      outFormat: oracledb.OUT_FORMAT_OBJECT,
                    }
                  );
                  results[subKey] = check
                    ? result.rows
                    : result.rows.length > 0
                    ? Object.values(result.rows[0])[0]
                    : null;
                  console.log(`${subKey}: ${results[subKey]}`);
                }
              );

              await Promise.all(subQueryPromises);
            } else if (key === "mysql") {
              const subQueryPromises = Object.entries(querySet).map(
                async ([subKey, subQuery]) => {
                  try {
                    console.log(`Executing ${subKey}`);

                    const [rows] = await mysql_connection.query(subQuery);

                    if (Array.isArray(rows)) {
                      results[subKey] = check
                        ? rows
                        : rows.length > 0
                        ? Object.values(rows[0])[0]
                        : null;
                    } else {
                      console.error(
                        `Unexpected result structure for ${subKey}:`,
                        rows
                      );
                      results[subKey] = null;
                    }

                    console.log(`${subKey}: ${results[subKey]}`);
                  } catch (error) {
                    console.error(`Error executing ${subKey}:`, error);
                    results[subKey] = null;
                    d;
                  }
                }
              );

              await Promise.all(subQueryPromises);
            }

            const queryExecutionTime = (
              (Date.now() - startTime) /
              1000
            ).toFixed(4);
            executionTimes[key] = queryExecutionTime;
            console.log(`Execution time for ${key}: ${queryExecutionTime} s`);
          } catch (err) {
            console.error(`Query execution failed for ${key}:`, err);
          }
        }
      );

      // Run all queries in parallel
      await Promise.all(queryPromises);

      console.log("\nFetch success...\n");
    }

    const overallExecutionTime = (
      (Date.now() - overallStartTime) /
      (1000 * 60)
    ).toFixed(4);
    return {
      status,
      data: results,
      ExecutionTime: overallExecutionTime,
      individualExecutionTime: executionTimes,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Database query failed" };
  } finally {
    // Close all connections
    try {
      if (connection_external) {
        await connection_external.close();
        console.log("Closed external connection");
      }
      if (connection_ussd) {
        await connection_ussd.close();
        console.log("Closed USSD connection");
      }
      if (connection_ussd_sum) {
        await connection_ussd_sum.close();
        console.log("Closed USSD sum connection");
      }
      if (connection_ussd_sum2) {
        await connection_ussd_sum2.close();
        console.log("Closed USSD sum2 connection");
      }
      if (mysql_connection) {
        await mysql_connection.end();
        console.log("Closed mysql_connection");
      }
    } catch (err) {
      console.error("Error closing connection:", err);
    }
  }
}

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT} and accessible on all interfaces.`
  );
});
