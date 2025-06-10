module.exports = (sequelize, DataTypes) => {
    const Route = sequelize.define("route", {
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
            allowNull: true,
            references: {
                model: 'zone',
                key: 'zone_id'
            }
        },
        route_code: {
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
        freezeTableName: true,
        timestamps: false,
        tableName: 'route' 
    });

    return Route;
}