const { DataTypes } = require("sequelize");
const { DateTime } = require("luxon");

module.exports = (sequelize) => {
  const Daily_cron_local_report = sequelize.define(
    "Daily_cron_local_report",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      data: {
        type: DataTypes.JSON,
        allowNull: false, // store the whole data object
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () =>
          DateTime.now().setZone("Africa/Addis_Ababa").toJSDate(),
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () =>
          DateTime.now().setZone("Africa/Addis_Ababa").toJSDate(),
      },
    },
    {
      tableName: "daily_cron_local_reports",
      timestamps: false, // disable automatic UTC timestamps
    }
  );

  return Daily_cron_local_report;
};
