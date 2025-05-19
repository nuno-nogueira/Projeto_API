module.exports = (sequelize, DataTypes, Collection_Point) => {
   const User = sequelize.define("user", {
       user_id:{ type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false, 
        //if a column has to be unique
        unique: {
            args: true,
            msg: "ID already exists"
        }},
       name:{
        type: DataTypes.STRING(50), 
        allowNull: false
        },
       tin:{
        type: DataTypes.TEXT, 
        allowNull: false, 
        unique: {
            args: true,
            msg: "TIN already exists"
        },
        //validate if its numeric
        validate: {isNumeric: true}},
       user_number:{
        type: DataTypes.STRING(50), 
        defaultValue: null,
        unique: {
            args: true,
            msg: "User Number already exists"
        },
        validate: {isNumeric: true}},
       password:{
        type: DataTypes.STRING(20), 
        allowNull: false},
       email:{
        type:DataTypes.STRING(50), 
        unique: {
            args: true,
            msg: "Email already exists"
        }, 
        //validate if its an email
        validate: {isEmail: true}},
       phone_number:{
        type:DataTypes.STRING(20), 
        unique: {
            args: true,
            msg: "Phone Number already exists"
        },
        validate: {isNumeric: true}},
       user_type:{
        type:DataTypes.ENUM('admin', 'driver', 'morador'), 
        allowNull: false, 
        defaultValue: null,
        //validate if its one of the parameters above
        validate: {
            isIn: {
                args: [['admin', 'driver', 'morador']],
                msg: "User type must be one of the following: admin, driver, or citizen"
            }
        }},
       door_to_door_service:{
        type:DataTypes.ENUM("sim","não"), 
        defaultValue: null,
        //validate if its one of the parameters above
        validate: {
            isIn: {
                args: [['sim','não']],
                msg: "Option must be yes or no"
            }
        }},
       address_point_id:{type:DataTypes.INTEGER,
            defaultValue: null, 
            //reference a column when its a foreign key (REFERENCE MODEL NAME IN EXPORT PARAMETERS)
           references: {
               model: Collection_Point,
               key: 'collection_point_id'
           }
       }
   }, {
       freezeTableName: true, //o nome da tabela é igual ao nome do modelo
       timestamps: false,
   });

   return User;
}