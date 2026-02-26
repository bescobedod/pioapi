// DevolucionCreateDto
import * as yup from "yup";
import { FilesConfigProps } from "../../types/MiddlewareTypes";
import { UploadedFile } from "express-fileupload";

export const DevolucionCreateDto = yup.object({
    empresa: yup.string().required("La [empresa] es un campo obligatorio."),
    tienda: yup.string().required("La [tienda] es un campo obligatorio."),
    idEntradaInventario: yup.number().required("El [idEntradaInventario] es un campo obligatorio."),
    detalle_devolucion: yup
        .array()
        .transform((value, originalValue) => {
          // Caso 1: viene como string completo
          if (typeof originalValue === "string") {
            try {
              return JSON.parse(originalValue.trim());
            } catch {
              throw new yup.ValidationError("[detalle_devolucion] debe ser un JSON válido.");
            }
          }
          // Caso 2: viene como array pero con strings dentro
          if (Array.isArray(originalValue)) {
            try {
              // Si el primer elemento es string tipo "[{...}]"
              if (typeof originalValue[0] === "string") {
                return JSON.parse(originalValue[0].trim());
              }
              return originalValue;
            } catch {
              throw new yup.ValidationError("[detalle_devolucion] contiene JSON inválido.");
            }
          }
          return value;
        })
        .of(
          yup.object({
            ItemCode: yup
              .string()
              .max(250, "[ItemCode] no puede tener más de 250 caracteres.")
              .required("El [ItemCode] es un campo obligatorio."),

            nombreProducto: yup
              .string()
              .max(500, "[nombreProducto] no puede tener más de 500 caracteres.")
              .nullable()
              .optional(),

            cantidadReal: yup
              .number()
              .typeError("[cantidadReal] debe ser un número.")
              .required("La [cantidadReal] es un campo obligatorio.")
              .min(0, "[cantidadReal] no puede ser negativa."),

            cantidadDevolver: yup
              .number()
              .typeError("[cantidadDevolver] debe ser un número.")
              .required("La [cantidadDevolver] es un campo obligatorio.")
              .min(0, "[cantidadDevolver] no puede ser negativa."),
          })
        )
        .required("El [detalle_devolucion] es un campo obligatorio.")
        .min(1, "Debe haber al menos un item en [detalle_devolucion].")
}).required()

export const fileConfigDevolucionCreateDto:FilesConfigProps[] = [
    {
        required: true,
        nameFormData: 'video_comprobante',
        maxFiles: 1,
        minFiles: 1,
        maxSize: 50,
        allowedTypes: ['video']
    },
    {
        required: true,
        nameFormData: 'foto_temperatura',
        maxFiles: 1,
        minFiles: 1,
        maxSize: 10,
        allowedTypes: ['image']
    },
]


export type DevolucionCreateDtoTypeFiles = {
    video_comprobante?: UploadedFile;
    foto_temperatura?: UploadedFile;
}

export type DevolucionCreateDtoType = yup.InferType<typeof DevolucionCreateDto>

export type DetalleDevolucionType = DevolucionCreateDtoType["detalle_devolucion"]