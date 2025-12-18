function getDate() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
 
async function isConnectionAlive(connection) {
    try {
      if (!connection) {
        return false; // Connection object is null or undefined
      }
  
      await connection.ping(); // Check if the connection is still alive
      return true; // Connection is active
    } catch (err) {
      return false; // Connection is lost or invalid
    }
  }


function formatJsonData(data) {
  const formattedData = {};

  for (const key in data) {
    if (data[key] === null) {
      formattedData[key] = "0";
    } else if (typeof data[key] === "number") {
      formattedData[key] = data[key]
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      formattedData[key] = data[key];
    }
  }

  return formattedData;
}


async function sendEmails() {
  try {
    console.log("Cron job: Sending login links to users...");

    const response = await axios.post(
      `${process.env.APP_URL}/api/email/send`
    );

    console.log("Cron result:", response.data);
  } catch (err) {
    console.error("Cron error:", err.message);
  }
}

  

module.exports = {getDate,isConnectionAlive,formatJsonData,sendEmails};
