import { Model, DataTypes } from "sequelize";
import { sequelizeInit } from "../../../config/database";

class CasoArchivoModel extends Model {
    public id_archivo?: string | undefined;
    public id_caso?: string | undefined;
    public s3_bucket?: string | undefined;
    public s3_key?: string | undefined;
    public nombre_original?: string | null | undefined;
    public mime_type?: string | null | undefined;
    public bytes?: number | null | undefined;
    public userCreatedAt?: number | null | undefined;
    public createdAt?: string | null | undefined;
    public updatedAt?: string | null | undefined;
}

CasoArchivoModel.init(
    {
        id_archivo: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        id_caso: {
            type: DataTypes.UUID,
            allowNull: false
        },
        s3_bucket: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        s3_key: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        nombre_original: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        mime_type: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        bytes: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        userCreatedAt: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeInit('PIOAPP'),
        tableName: "tbl_caso_archivo",  
        schema: "web",             
        timestamps: true
    }
)

export default CasoArchivoModel