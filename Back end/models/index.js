const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config").development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

fs.readdirSync(__dirname)
  .filter(f => f !== "index.js" && f.endsWith(".js"))
  .forEach(file => {
    const modelDef = require(path.join(__dirname, file));
    const model = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;