const dbConfig = require("../config/db.config2.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.class_years = require("./class-year.model.js")(sequelize, Sequelize);
db.geographical_region = require("./geographical-region.model.js")(sequelize, Sequelize);
db.restriction_fields = require("./restriction-fields.model.js")(sequelize, Sequelize);
db.restriction = require("./restriction.model.js")(sequelize, Sequelize);
db.divisions = require("./divisions.model.js")(sequelize, Sequelize);
db.client = require("./client.model.js")(sequelize, Sequelize);
db.vehicle = require("./vehicle.model.js")(sequelize, Sequelize);
db.school_billing_informations = require("./school-billing-informations.model.js")(sequelize, Sequelize);
db.worker = require("./worker.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);

db.divisions.belongsTo(db.client, {foreignKey: 'client_id'})


module.exports = db;