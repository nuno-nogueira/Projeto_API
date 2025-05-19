module.exports = (sequelize, DataTypes) => {
    const Container = sequelize.define("container", {
        container_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            allowNull: false, 
            autoIncrement: true, 
            unique: {
                args: true,
                msg: "ID already exists"
            }
        },
        RFID: { 
            type: DataTypes.STRING(45), 
            allowNull: false,
            unique: {
                args: true,
                msg: "RFID must be unique"
            },
            validate: {
                notEmpty: {
                    args: true,
                    msg: "RFID cannot be empty"
                }
            }
        },
        residual_type: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: 'tipo_residuo',
                key: 'idtipo_residuo'
            }
        },
        collection_point_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: 'collection_point',
                key: 'collection_point_id'
            }
        },
        last_collection_date: { 
            type: DataTypes.DATE, 
            allowNull: true,
            defaultValue: null,
            validate: {
                isDate: {
                    args: true,
                    msg: "Must be a valid date"
                }
            }
        },
        capacity: { 
            type: DataTypes.STRING(10), 
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Capacity cannot be empty"
                }
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'container'
    });
    
    return Container;
};