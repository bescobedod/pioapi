import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";
import CategoriasPublicacionModel from "./CategoriasPublicacionModel";

const sequelize = sequelizeInit("PIOAPP");

class PublicacionesModel extends Model {
  public id_publicacion!: number;
  public id_categoria_publicacion!: number;
  public titulo!: string;
  public mensaje!: string;
  public id_roles!: number[] | null;
  public estado!: boolean;
  public user_created!: number | null;
  public user_updated!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PublicacionesModel.init(
  {
    id_publicacion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_categoria_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CategoriasPublicacionModel,
        key: "id_categoria_publicacion",
      },
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_roles: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
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
    tableName: "tbl_publicacion",
    schema: "web",
    sequelize,
    timestamps: true,
  },
);

// Relaciones
PublicacionesModel.belongsTo(CategoriasPublicacionModel, {
  foreignKey: "id_categoria_publicacion",
  as: "categoria",
});
CategoriasPublicacionModel.hasMany(PublicacionesModel, {
  foreignKey: "id_categoria_publicacion",
  as: "publicaciones",
});

export default PublicacionesModel;
