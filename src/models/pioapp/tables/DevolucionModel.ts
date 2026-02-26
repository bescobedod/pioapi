import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class DevolucionModel extends Model {
    public id_devolucion!: number;
    public empresa!: string;
    public tienda!: string;
    public idEntradaInventario!: number;
    public id_devolucion_estado!: number;
    public url_video_comprobante!: string;
    public fotografia_temperatura!: string;
    public anulado!: boolean;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

DevolucionModel.init(
    {
        id_devolucion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        empresa: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        tienda: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        idEntradaInventario: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        id_devolucion_estado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url_video_comprobante: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fotografia_temperatura: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        anulado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        tableName: "devolucion",
        schema: "app",
        timestamps: true
    }
)

export default DevolucionModel