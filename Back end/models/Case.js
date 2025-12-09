module.exports = (sequelize, Sequelize) => {
  const Case = sequelize.define("Case", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    case_type: { type: Sequelize.STRING },
    case_title: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING },
    user_id: {
      type: Sequelize.INTEGER,
      references: { model: "users", key: "id" }
    }
  }, {
    tableName: "cases"
  });

  Case.associate = (db) => {
    Case.belongsTo(db.User, { foreignKey: "user_id" });
  };

  return Case;
};
