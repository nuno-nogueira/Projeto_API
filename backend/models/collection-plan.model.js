module.exports = (sequelize, DataTypes) => {
    const Collection_Plan = sequelize.define("collection_plan", {
        plan_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            allowNull: false, 
            autoIncrement: true, 
            unique: {
                args: true,
                msg: "ID already exists"
            }
        },
        year: { 
            type: DataTypes.year(4), 
            allowNull: false,
        },
        Waste_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: 'tipo_residuo',
                key: 'idtipo_residuo'
            }
        },
        zone_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: 'Zone',
                key: 'zone_id'
            }
        },
        Collection_days: { 
           type: DataTypes.SET('SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'),
            allowNull: false}
    }, {
        freezeTableName: true,
        timestamps: false,
        // tableName: 'collection_plan'
    });
    
    return Collection_Plan;
};