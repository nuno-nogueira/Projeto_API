const path = require('path');
 require('dotenv').config({
  path: path.resolve(__dirname, '../.env')  // sobe uma pasta e aponta para o .env na raiz do backend
});
        
 const { Sequelize } = require('sequelize');

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


db.RFIDReading = require("./readings.model.js")(sequelize, Sequelize.DataTypes)
db.Container = require("./containers.model.js")(sequelize, Sequelize.DataTypes)
db.Collection_Guide = require("./collection-guides.model.js")(sequelize, Sequelize.DataTypes)

db.Waste_Type=require('./waste-types.model.js')(sequelize,Sequelize.DataTypes)
db.Route=require('./waste-types.model.js')(sequelize,Sequelize.DataTypes)
db.Vehicle=require('./waste-types.model.js')(sequelize,Sequelize.DataTypes)
db.Zone=require('./waste-types.model.js')(sequelize,Sequelize.DataTypes)


//define the relationships
//1:N - 1 Collection_Point - N Users
db.Collection_Point.hasMany(db.User, {
    foreignKey: "address_point_id",
    onUpdate: "SET NULL",
    onDelete: "CASCADE",
})
db.User.belongsTo(db.Collection_Point, {
    foreignKey: "address_point_id"
})

//1: N - 1 User - N Feedbacks
db.User.hasMany(db.Feedback, {
    foreignKey: "user_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
})
db.Feedback.belongsTo(db.User, {
    foreignKey: "user_id"
})

//1: N - 1 Collection_Point - N Feedbacks
db.Collection_Point.hasMany(db.Feedback, {
    foreignKey: "collection_point_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.Feedback.belongsTo(db.Collection_Point, {
    foreignKey: "collection_point_id"
})


//1: N - 1 Container - N RFIDReadings
db.Container.hasMany(db.RFIDReading, {
    foreignKey: "container_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.RFIDReading.belongsTo(db.Container, {
    foreignKey: "container_id"
})

//1: N - 1 Collection_Point - N Containers
db.Collection_Point.hasMany(db.Container, {
    foreignKey: "collection_point_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.Container.belongsTo(db.Collection_Point, {
    foreignKey: "collection_point_id"
})

//1: N - 1 RFIDReading - N Container
db.Container.hasMany(db.RFIDReading, {
    foreignKey: "container_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.RFIDReading.belongsTo(db.Container, {
    foreignKey: "container_id"
})

//1: N - 1 Collection_Guide - N RFIDReadings
db.Collection_Guide.hasMany(db.RFIDReading, {
    foreignKey: "collection_guide_id",
    onUpdate: "CASCADE", 
    onDelete: "CASCADE",
})
db.RFIDReading.belongsTo(db.Collection_Guide, {
    foreignKey: "collection_guide_id",

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

//----------------------

//export the DB object w/ the Sequelize instance and models
module.exports = db;