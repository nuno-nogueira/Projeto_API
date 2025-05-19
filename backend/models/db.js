 require('dotenv').config();
 const path = require('path');
// Load .env from the parent (backend) directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
 // Debug: Check if vars are loaded
console.log('Environment Variables:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_PASSWORD: process.env.DB_PASSWORD ? '*****' : 'undefined'
});
 const { Sequelize, DataTypes } = require('sequelize');

 //database connection properties
 const sequelize = new Sequelize('Grupo03', 'g03', 'Pv>ncWJ6St', 
{
  host: '172.22.0.201',
  dialect: 'mysql',
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

//----------------------
db.RFIDReading = require("./readings.model.js")(sequelize, Sequelize.DataTypes)
db.Container = require("./containers.model.js")(sequelize, Sequelize.DataTypes)
db.Collection_Guide = require("./collection-guides.model.js")(sequelize, Sequelize.DataTypes)

//----------------------

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

//----------------------

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
})

//----------------------

//export the DB object w/ the Sequelize instance and models
module.exports = db;