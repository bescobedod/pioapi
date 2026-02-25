import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";
import PublicacionesModel from "./PublicacionesModel";
import UsersModel from "./UsersModel";

const sequelize = sequelizeInit("PIOAPP");

class UsuarioPublicacionesVistasModel extends Model {
  public id_vista!: number;
  public id_publicacion!: number;
  public id_usuario!: number;
  public fecha_visto!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UsuarioPublicacionesVistasModel.init(
  {
    id_vista: {
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
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UsersModel,
        key: "id_users",
      },
      onDelete: "CASCADE",
    },
    fecha_visto: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usuario_publicaciones_vistas",
    schema: "app",
    sequelize,
    timestamps: true,
  },
);

UsuarioPublicacionesVistasModel.belongsTo(PublicacionesModel, {
  foreignKey: "id_publicacion",
  as: "publicacion",
});
PublicacionesModel.hasMany(UsuarioPublicacionesVistasModel, {
  foreignKey: "id_publicacion",
  as: "vistas",
});

UsuarioPublicacionesVistasModel.belongsTo(UsersModel, {
  foreignKey: "id_usuario",
  as: "usuario",
});
UsersModel.hasMany(UsuarioPublicacionesVistasModel, {
  foreignKey: "id_usuario",
  as: "publicaciones_vistas",
});

export default UsuarioPublicacionesVistasModel;
