import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

const sequelize = sequelizeInit("PIOAPP");

class CategoriasPublicacionModel extends Model {
  public id_categoria_publicacion!: number;
  public nombre!: string;
  public color!: string;
  public estado!: boolean;
  public user_created!: number | null;
  public user_updated!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CategoriasPublicacionModel.init(
  {
    id_categoria_publicacion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "#000000",
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    user_created: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_updated: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_categoria_publicacion",
    schema: "web",
    sequelize,
    timestamps: true,
  },
);

export default CategoriasPublicacionModel;
