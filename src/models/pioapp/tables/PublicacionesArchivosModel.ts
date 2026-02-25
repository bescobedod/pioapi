import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";
import PublicacionesModel from "./PublicacionesModel";

const sequelize = sequelizeInit("PIOAPP");

class PublicacionesArchivosModel extends Model {
  public id_archivo_pub!: number;
  public id_publicacion!: number;
  public url_archivo!: string;
  public nombre_archivo!: string;
  public tipo!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PublicacionesArchivosModel.init(
  {
    id_archivo_pub: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PublicacionesModel,
        key: "id_publicacion",
      },
      onDelete: "CASCADE",
    },
    url_archivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nombre_archivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "tbl_publicacion_archivo",
    schema: "web",
    sequelize,
    timestamps: true,
  },
);

PublicacionesArchivosModel.belongsTo(PublicacionesModel, {
  foreignKey: "id_publicacion",
  as: "publicacion",
});
PublicacionesModel.hasMany(PublicacionesArchivosModel, {
  foreignKey: "id_publicacion",
  as: "archivos",
});

export default PublicacionesArchivosModel;
