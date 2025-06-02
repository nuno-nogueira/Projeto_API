module.exports = (sequelize, DataTypes, Route) => {
    const Collection_Point = sequelize.define("collection_point", {
        collection_point_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            allowNull: false, 
            autoIncrement: true, 
            isInt: true,
            unique: {
                args: true,
                msg: "ID already exists"
            }},
        collection_point_type: { 
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
        geographical_coordinates: { 
            type: DataTypes.STRING(45)},
        opening_hours: { 
            type: DataTypes.STRING(45), 
            defaultValue: null},
        street_name: { 
            type: DataTypes.STRING(100), 
            len: [10, 100],
            allowNull: false},
        postal_code: { 
            type: DataTypes.STRING(10), 
            allowNull: false,
            len: [9, 10]
        },
        door_number: { 
            type: DataTypes.STRING(10), 
            isInt: true,
            min: 1,
            max: 50,
            defaultValue: null},
        route_id: { 
            type: DataTypes.INTEGER, 
            references:{
            model: Route,
            key: "route_id"},
            defaultValue: null,
            isInt: true,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });

    return Collection_Point;
}