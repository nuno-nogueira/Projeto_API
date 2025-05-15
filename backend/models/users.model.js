module.exports = (sequelize, DataTypes, Collection_Point) => {
   const User = sequelize.define("utilizador", {
       id_utilizador:{ type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false, 
        //if a column has to be unique
        unique: {
            args: true,
            msg: "ID already exists"
        }},
       nome:{
        type: DataTypes.STRING(50), 
        allowNull: false
        },
       nif:{
        type: DataTypes.TEXT, 
        allowNull: false, 
        unique: {
            args: true,
            msg: "TIN already exists"
        },
        //validate if its numeric
        validate: {isNumeric: true}},
       num_utilizador:{
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
       contacto_email:{
        type:DataTypes.STRING(50), 
        unique: {
            args: true,
            msg: "Email already exists"
        }, 
        //validate if its an email
        validate: {isEmail: true}},
       contacto_telefone:{
        type:DataTypes.STRING(20), 
        unique: {
            args: true,
            msg: "Phone Number already exists"
        },
        validate: {isNumeric: true}},
       tipo_utilizador:{
        type:DataTypes.ENUM('admin', 'motorista', 'morador'), 
        allowNull: false, 
        defaultValue: null,
        //validate if its one of the parameters above
        validate: {
            isIn: {
                args: [['admin', 'motorista', 'morador']],
                msg: "User type must be one of the following: admin, driver, or citizen"
            }
        }},
       servico_porta_porta:{
        type:DataTypes.ENUM("sim","não"), 
        defaultValue: null,
        //validate if its one of the parameters above
        validate: {
            isIn: {
                args: [['sim','não']],
                msg: "Option must be yes or no"
            }
        }},
       idponto_moradia:{type:DataTypes.INTEGER,
            defaultValue: null, 
            //reference a column when its a foreign key (REFERENCE MODEL NAME IN EXPORT PARAMETERS)
           references: {
               model: Collection_Point,
               key: 'idponto_recolha'
           }
       }
   }, {
       freezeTableName: true, //o nome da tabela é igual ao nome do modelo
       timestamps: false,
   });

   return User;
}