module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: { type: DataTypes.STRING },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("Admin", "User"),
      defaultValue: "User"
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
