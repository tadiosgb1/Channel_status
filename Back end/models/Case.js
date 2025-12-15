module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define("Case", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    case_type: {
      type: DataTypes.STRING,
      allowNull: false
    },

    case_title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT
    },

    status: {
      type: DataTypes.ENUM("pending", "resolved"),
      defaultValue: "pending",
      allowNull: false
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    }
  }, {
    tableName: "cases"
  });

  Case.associate = (db) => {
    Case.belongsTo(db.User, { foreignKey: "user_id" });
  };

  return Case;
};
