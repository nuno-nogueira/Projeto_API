module.exports = (sequelize, DataTypes) => {
    const RFIDReading = sequelize.define("rfid_reading", {
        rfid_reading_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: {
                args: true,
                msg: "The reading ID must be unique"
            }
        },
        container_id: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            references: {
                model: 'containers',
                key: 'container_id'
            }
        },
        collection_guide_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: null,
            references: {
                model: 'collection_guide',
                key: 'collection_guide_id'
            }
        },
        reading_date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    args: true,
                    msg: "Must be a valid date and time"
                }
            }
        },
        weight_collected: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: {
                    args: true,
                    msg: "Weight must be a number"
                }
            }
        },
        collection_status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: false
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'rfid_reading'
    });

    return RFIDReading;
};