import { DataTypes, Model } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class DevolucionEstadoModel extends Model {
    public id_devolucion_estado!: number;
    public name!: string;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

DevolucionEstadoModel.init(
    {
        id_devolucion_estado: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        userCreatedAt: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        userUpdatedAt: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: "devolucion_estado",
        schema: "app",
        timestamps: true
    }
)

export default DevolucionEstadoModel