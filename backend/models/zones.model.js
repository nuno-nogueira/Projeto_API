module.exports = (sequelize, DataTypes) => {
    const Zone = sequelize.define("zone", {
        zone_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: {
                args: true,
                msg: "ID already exists"
            }
        },
        geographical__coordinates: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique:{
                args: true,
                msg: "Those coordinates already exist"
            }
        },
        zone_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: {
                args: true,
                msg: "That already exists"
            }
        },
    }, {
        timestamps: false,
        // freezeTableName: true,
        tableName: 'zone'
    });

    return Zone;
}