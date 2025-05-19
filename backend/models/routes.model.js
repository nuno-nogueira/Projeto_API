module.exports = (sequelize, DataTypes) => {
    const Route = sequelize.define("Route", {
        route_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: {
                args: true,
                msg: "This ID already exists"
            }
        },
        zone_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        route_cod: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique:{
                args: true,
                msg: "This waste code already exists"
            }
        },
        driver_id: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
    }, {
        TableName: 'route',
        timestamps: false,
    });

    return Route;
}