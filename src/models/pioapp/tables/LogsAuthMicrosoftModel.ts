import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class LogsAuthMicrosoftModel extends Model {
  public id_log!: number;
  public id_user?: number;
  public action!: string;
  public request_data?: any;
  public status!: boolean;
  public error_message?: string;
  public readonly created_at!: Date;
}

LogsAuthMicrosoftModel.init(
  {
    id_log: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_user: { type: DataTypes.BIGINT, allowNull: true },
    action: { type: DataTypes.STRING(50), allowNull: false },
    request_data: { type: DataTypes.JSONB, allowNull: true },
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    error_message: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize: sequelizeInit("PIOAPP"),
    tableName: "log_auth_microsoft",
    schema: "log",
    timestamps: false,
  },
);

export default LogsAuthMicrosoftModel;
