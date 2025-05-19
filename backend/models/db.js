 const { Sequelize, DataTypes } = require('sequelize');

 //database connection properties
 const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
{
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 5, min: 0,
    acquire: 30000, idle: 10000
  }
});

//test the connection to the DB & queries
(async () => {
    try {
        //test connection
        await sequelize.authenticate();
        console.log('Connection has been established sucessfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();


const db = {}; //object to be exported;
db.sequelize = sequelize; //save the Sequelize instance

//include models here!!
db.Collection_Point = require("./collection-points.model.js")(sequelize, Sequelize.DataTypes)
db.User = require("./users.model.js")(sequelize, Sequelize.DataTypes, db.Collection_Point)
db.Feedback = require("./feedbacks.model.js")(sequelize, Sequelize.DataTypes,  db.Collection_Point, db.User) 

db.Waste_Type=require('./waste-types.model.js')(sequelize,Sequelize.DataTypes)
db.Route=require('./waste-types.model.js')(sequelize,Sequelize.DataTypes)
db.Vehicle=require('./waste-types.model.js')(sequelize,Sequelize.DataTypes)
db.Zone=require('./waste-types.model.js')(sequelize,Sequelize.DataTypes)

//define the relationships
//1:N - 1 Collection_Point - N Users
db.Collection_Point.hasMany(db.User, {
    foreignKey: "idponto_moradia",
    onUpdate: "SET NULL",
    onDelete: "CASCADE",
})
db.User.belongsTo(db.Collection_Point, {
    foreignKey: "idponto_moradia"
})

//1: N - 1 User - N Feedbacks
db.User.hasMany(db.Feedback, {
    foreignKey: "id_utilizador",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
})
db.Feedback.belongsTo(db.User, {
    foreignKey: "id_utilizador"
})

//1: N - 1 Collection_Point - N Feedbacks
db.Collection_Point.hasMany(db.Feedback, {
    foreignKey: "id_ponto_recolha",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.Feedback.belongsTo(db.Collection_Point, {
    foreignKey: "id_ponto_recolha"
})


//1:N - 1 Waste_Type - N Vehicles
db.Waste_Type.hasMany(db.Vehicle, {
    foreignKey: "vehicle_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.Vehicle.belongsTo(db.Waste_Type, {
    foreignKey: "vehicle_id"
})


//1:N - 1 zone - N routes
db.Zone.hasMany(db.Route, {
    foreignKey: "route_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.Route.belongsTo(db.Zone, {
    foreignKey: "route_id"
})


//export the DB object w/ the Sequelize instance and models
module.exports = db;