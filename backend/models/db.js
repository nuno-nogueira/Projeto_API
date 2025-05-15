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


//export the DB object w/ the Sequelize instance and models
module.exports = db;