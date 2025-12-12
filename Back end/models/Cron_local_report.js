module.exports = (sequelize, Sequelize) => {
  const Cron_local_report = sequelize.define("Cron_local_report", {
    id: { 
      type: Sequelize.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },

    data: {
      type: Sequelize.JSON,   // store whole data object
      allowNull: false
    }
  }, {
    tableName: "cron_local_reports"
  });

  return Cron_local_report;
};
