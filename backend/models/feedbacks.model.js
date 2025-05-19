module.exports = (sequelize, DataTypes, Collection_Point, User) => {
    const Feedback = sequelize.define("feedback", {
        feedback_id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
            unique: {
                args: true,
                msg: "ID already exists"
            }},
        description: { 
            type: DataTypes.TEXT, 
            allowNull: false},
        feedback_type: { 
            type: DataTypes.ENUM("conservação", "recolha", "outro"), 
            defaultValue: "outro", 
            allowNull: false,
            validate: {
                isIn: {
                    args: [['conservação', 'recolha', 'outro']],
                    msg: "Feedback type must be one of the following: conservation, collection, or other"
                }
            }},
        collection_point_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            references: {
            model: Collection_Point,
            key: "idponto_recolha", 
        }}, 
        user_id: { 
            type: DataTypes.INTEGER, 
            references: {
            model: User,
            key: "user_id"
        }, 
        allowNull: false, 
        defaultValue: null
        },
        feedback_date: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW
        }
    }
, {
        freezeTableName: true,
        timestamps: false
    });

    return Feedback;
}