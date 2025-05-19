 const path = require('path');
 require('dotenv').config({
  path: path.resolve(__dirname, '../.env')  // sobe uma pasta e aponta para o .env na raiz do backend
});
        
 const { Sequelize } = require('sequelize');

 //database connection properties
const sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        // connection pool settings
        pool: {
            max: 5, // maximum number of connections in pool
            min: 0, // minimum number of connections in pool
            acquire: 30000, // maximum time (in ms) that a connection can be idle before being released
            idle: 10000 // maximum time (in ms) that a connection can be idle before being released
        }
    }
);

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


//export the DB object w/ the Sequelize instance and models
module.exports = db;