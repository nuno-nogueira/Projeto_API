module.exports = (sequelize, DataTypes, Collection_Point, User) => {
    const Feedback = sequelize.define("feedback", {
        idfeedback: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
            unique: {
                args: true,
                msg: "ID already exists"
            }},
        descricao: { 
            type: DataTypes.TEXT, 
            allowNull: false},
        Tipo_feedback: { 
            type: DataTypes.ENUM("conservação", "recolha", "outro"), 
            defaultValue: "outro", 
            allowNull: false,
            validate: {
                isIn: {
                    args: [['conservação', 'recolha', 'outro']],
                    msg: "Feedback type must be one of the following: conservation, collection, or other"
                }
            }},
        id_ponto_recolha: { 
            type: DataTypes.INTEGER, 
            references: {
            model: Collection_Point,
            key: "idponto_recolha"
        }, 
        allowNull: false, 
        id_utilizador: { 
            type: DataTypes.INTEGER, 
            references: {
            model: User,
            key: "id_utilizador"
        }, 
        allowNull: false, 
        defaultValue: null
        },
        date_time: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW
        }
    }
}, {
        freezeTableName: true,
        timestamps: false
    });

    return Feedback;
}