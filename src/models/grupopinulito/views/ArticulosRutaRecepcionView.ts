import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";
class ArticulosRutaRecepcionView extends Model {
  public id_pedido?: number;
  public codigo_articulo?: string;
  public nombre_articulo?: string;
  public description?: string;
  public cantidad?: number;
  public serie?: string;
  public numero?: number;
}
ArticulosRutaRecepcionView.init(
  {
    // id: { type: DataTypes.BIGINT, primaryKey: true },
    id_pedido: { type: DataTypes.INTEGER, allowNull: true, primaryKey: true },
    codigo_articulo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      primaryKey: true,
    },
    nombre_articulo: { type: DataTypes.STRING(500), allowNull: true },
    description: { type: DataTypes.STRING(500), allowNull: true },
    cantidad: { type: DataTypes.FLOAT, allowNull: true },
    serie: { type: DataTypes.STRING(100), allowNull: true, primaryKey: true },
    numero: { type: DataTypes.INTEGER, allowNull: true, primaryKey: true },
  },
  {
    sequelize: sequelizeInit("GRUPOPINULITO"),
    tableName: "vwArticulosRutaRecepcion",
    timestamps: false,
  },
);
export default ArticulosRutaRecepcionView;
