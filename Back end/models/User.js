module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
   
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
   
      validate: {
        isEmail: true
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM("Admin", "User"),
      defaultValue: "User"
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active"
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Case, {
      foreignKey: "user_id",
      onDelete: "CASCADE"
    });
  };

  return User;
};
