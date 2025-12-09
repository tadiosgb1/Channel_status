module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("Admin", "User"),
      defaultValue: "User"
    }
  });

  return User;
};