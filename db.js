import fs from "fs";
import path from "path";
import Sequelize from "sequelize";

let db = null;

module.exports = () => {
    if (!db) {
        const config = require("./src/libs/config.js");
        const sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config.params
        );
        db = {
           sequelize,
           Sequelize,
           models: {}
        };
        const dir = path.join(__dirname, "src/models");
        fs.readdirSync(dir).forEach(file => {
          const modelDir = path.join(dir, file);
          const model = sequelize.import(modelDir);
          db.models[model.name] = model;
        });
        Object.keys(db.models).forEach(key => {
            db.models[key].options.classMethods.associate(db.models);
        });
    }
    return db;
};