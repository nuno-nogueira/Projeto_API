module.exports = (sequelize, DataTypes) => {
    const Waste_Type = sequelize.define("Waste", {
        waste_type_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: {
                args: true,
                msg: "This ID already exists"
            }
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique:{
                args: true,
                msg: "This waste name already exists"
            }
        },
        identifying_color: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: {
                args: true,
                msg: "This waste color already exists"
            }
        },
    }, {
        TableName: 'waste_type',
        timestamps: false,
    });

    return Waste_Type;
}