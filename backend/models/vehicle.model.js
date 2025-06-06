module.exports = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define("vehicle", {
        vehicle_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: {
                args: true,
                msg: "This ID already exists"
            }
        },
        plate: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique:{
                args: true,
                msg: "This plate already exists"
            }
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: true,

        },
        waste_id: {
            type: DataTypes.INTEGER,
            allowNull: true,

        },
    }, {
        freezeTableName: true,
        timestamps: false,
    });

    return Vehicle;
}