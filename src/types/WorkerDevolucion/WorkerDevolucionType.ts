import { DevolucionCreateDtoType, DevolucionCreateDtoTypeFiles } from "../../dtos/Devolucion/DevolucionCreateDto";
import { userToken } from "../ResponseTypes";

export type DataJobCrearDevolucion = {
    data:DevolucionCreateDtoType;
    files:DevolucionCreateDtoTypeFiles; 
    user:userToken;
}