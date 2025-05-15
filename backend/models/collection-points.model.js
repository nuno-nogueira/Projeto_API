module.exports = (sequelize, DataTypes) => {
    const Collection_Point = sequelize.define("ponto_recolha", {
        idponto_recolha: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            allowNull: false, 
            autoIncrement: true, 
            unique: {
                args: true,
                msg: "ID already exists"
            }},
        tipo_ponto: { 
            type: DataTypes.ENUM("ecocentro", "ecoponto", "moradia"), 
            allowNull: false, 
            defaultValue: "ecoponto",
            // validate if its one of the parameters above
            validate: {
                isIn: {
                    args: [['ecocentro', 'ecoponto', 'moradia']],
                    msg: "Collection Point type must be one of the following: ecocentro, ecoponto, moradia"
                }
            }
            },
        coordenadas_geograficas: { 
            type: DataTypes.STRING(45), 
            allowNull: false},
        horario_funcionamento: { 
            type: DataTypes.STRING(45), 
            defaultValue: null},
        rua: { 
            type: DataTypes.STRING(100), 
            allowNull: false},
        cod_postal: { 
            type: DataTypes.STRING(10), 
            allowNull: false},
        numero_porta: { 
            type: DataTypes.STRING(10), 
            defaultValue: null},
        rota: { 
            type: DataTypes.INTEGER, 
            // references:{
            // model: Route,
            // key: "idrota"}
            defaultValue: null,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });

    return Collection_Point;
}