import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class DevolucionDetalleModel extends Model {
    public id_devolucion_detalle!: number;
    public id_devolucion!: number;
    public ItemCode!: string;
    public nombreProducto!: string | null;
    public cantidadReal!: number;
    public cantidadDevolver!: number;
    public userCreatedAt!: number | null;
    public userUpdatedAt!: number | null;
    public readonly createdAt!: string;
    public readonly updatedAt!: string;
}

DevolucionDetalleModel.init(
    {
        id_devolucion_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        id_devolucion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ItemCode: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        nombreProducto: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        cantidadReal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        cantidadDevolver: {
            type: DataTypes.DECIMAL(10, 2),
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
        tableName: "devolucion_detalle",
        schema: "app",
        timestamps: true
    }
)

export default DevolucionDetalleModel