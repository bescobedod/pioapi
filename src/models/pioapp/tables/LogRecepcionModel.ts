import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class LogRecepcionModel extends Model {
  public id_log!: number;
  public data!: object;
  public user_session!: object;
  public user_created_at!: Date | null;
  public user_updated_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

LogRecepcionModel.init(
  {
    id_log: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    user_session: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    user_created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInit("PIOAPP"),
    tableName: "log_recepcion",
    schema: "log",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default LogRecepcionModel;
