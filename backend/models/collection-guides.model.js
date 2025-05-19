// // placeholder for now
// let collection_guides = [
//     {
//         id: 1,
//         date: "12h00 19/04/2024",
//         vehicle_id: 1,
//         residual_code: 1,
//         collection_status: "DONE",
//         route: 1
//     },
//     {
//         id: 2,
//         date: "12h00 19/04/2024",
//         vehicle_id: 2,
//         residual_code: 2,
//         collection_status: "IN PROGRESS",
//         route: 2
//     },
//     {
//         id: 3,
//         date: "12h00 19/04/2024",
//         vehicle_id: 1,
//         residual_code: 1,
//         collection_status: "ON HOLD",
//         route: 1
//     }
// ]

// // Data will go here
// module.exports = collection_guides



module.exports = (sequelize, DataTypes) => {
    const Collection_Guide = sequelize.define("collection_guide", {
        collection_guide_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            allowNull: false, 
            autoIncrement: true, 
            unique: {
                args: true,
                msg: "ID already exists"
            }
        },
        issue_date: { 
            type: DataTypes.DATE, 
            allowNull: false,
            validate: {
                isDate: {
                    args: true,
                    msg: "It must be a valid date"
                }
            }
        },
        waste_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: 'waste_type', 
                key: 'waste_type_id'
            }
        },
        collection_status: { 
            type: DataTypes.ENUM('pendente', 'concluída', 'em execução', 'não iniciada'), 
            allowNull: false, 
            defaultValue: 'não iniciada',
            validate: {
                isIn: {
                    args: [['pendente', 'concluída', 'em execução', 'não iniciada']],
                    msg: "Obrigatório ser um: pendente, concluída, em execução, não iniciada"
                }
            }
        },
        route_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'route', 
                key: 'route_id'
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'collection_guide' 
    });

    return Collection_Guide;
};