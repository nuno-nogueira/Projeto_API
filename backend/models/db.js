//////////////////////////////////////////////////////////////////
//npm i @googlemaps/js-api-loader
//////////////////////////////////////////////////////////////////


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
db.Collection_Point = require("./collection-points.model.js")(sequelize, Sequelize.DataTypes, db.Route)
db.User = require("./users.model.js")(sequelize, Sequelize.DataTypes, db.Collection_Point)
db.Feedback = require("./feedbacks.model.js")(sequelize, Sequelize.DataTypes,  db.Collection_Point, db.User) 


db.RFIDReading = require("./readings.model.js")(sequelize, Sequelize.DataTypes)
db.Container = require("./containers.model.js")(sequelize, Sequelize.DataTypes)
db.Collection_Guide = require("./collection-guides.model.js")(sequelize, Sequelize.DataTypes)

db.Waste_Type=require('./waste-types.model.js')(sequelize,Sequelize.DataTypes)

db.Route=require('./routes.model.js')(sequelize,Sequelize.DataTypes)
db.Vehicle=require('./vehicle.model.js')(sequelize,Sequelize.DataTypes)
db.Zone=require('./zones.model.js')(sequelize,Sequelize.DataTypes)
db.Collection_Plan=require('./collection-plan.model.js')(sequelize,Sequelize.DataTypes)

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

//1: N - 1 Collection_Guide - N RFIDReadings
db.Collection_Guide.hasMany(db.RFIDReading, {
    foreignKey: "collection_guide_id",
    onUpdate: "CASCADE", 
    onDelete: "CASCADE",
})
db.RFIDReading.belongsTo(db.Collection_Guide, {
    foreignKey: "collection_guide_id",
})

//1:N - 1 Waste_Type - N Vehicles
db.Waste_Type.hasMany(db.Collection_Guide, {
    foreignKey: "waste_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.Collection_Guide.belongsTo(db.Waste_Type, {
    foreignKey: "waste_id",
})

// 1:N - 1 Waste_Type - N Containers
db.Waste_Type.hasMany(db.Container, {
  foreignKey: "waste_type_id",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
})
db.Container.belongsTo(db.Waste_Type, {
  foreignKey: "waste_type_id",
})

//1:N - 1 Route - N Collection_Guide
db.Route.hasMany(db.Collection_Guide, {
    foreignKey: "route_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.Collection_Guide.belongsTo(db.Route, {
    foreignKey: "route_id",
})


//1:N - 1 Waste_Type - N Vehicles
db.Waste_Type.hasMany(db.Vehicle, {
    foreignKey: "waste_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.Vehicle.belongsTo(db.Waste_Type, {
    foreignKey: "waste_id",
})


//1:N - 1 zone - N routes
db.Zone.hasMany(db.Route, {
    foreignKey: "zone_id",
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
})
db.Route.belongsTo(db.Zone, {
    foreignKey: "zone_id"
})

db.Route.hasMany(db.Collection_Point, { 
    foreignKey: 'route_id' 
})
db.Collection_Point.belongsTo(db.Route, { 
    foreignKey: 'route_id' 
})

db.Zone.hasMany(db.Collection_Plan, {
    foreignKey: "plan_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
})
db.Collection_Plan.belongsTo(db.Zone, {
    foreignKey: "plan_id"
})

db.Waste_Type.hasMany(db.Collection_Plan, {
    foreignKey: "plan_id",
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
})
db.Collection_Plan.belongsTo(db.Waste_Type, {
    foreignKey: "plan_id"
})



//----------------------
db.Route.belongsTo(db.User, { foreignKey: 'driver_id' });
//db.Route.belongsTo(db.Vehicle, { foreignKey: 'vehicle_id' });
//db.Vehicle.hasMany(db.Feedback, { foreignKey: 'vehicle_id' });


db.Route.belongsTo(db.User, { 
    foreignKey: 'driver_id' 
});
db.User.hasMany(db.Route, { 
    foreignKey: 'driver_id' 
});
// db.Route.belongsTo(db.Vehicle, { foreignKey: 'vehicle_id' });
// db.Vehicle.hasMany(db.Feedback, { foreignKey: 'vehicle_id' });



//export the DB object w/ the Sequelize instance and models
module.exports = db;