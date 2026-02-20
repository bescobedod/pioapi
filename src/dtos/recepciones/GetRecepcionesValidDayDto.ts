// GetRecepcionesValidDayDto
import * as yup from 'yup';

export const GetRecepcionesValidDayDto = yup.object({
    empresa: yup.string().required("La [empresa] es un campo obligatorio."),
    tienda: yup.string().required("La [tienda] es un campo obligatorio.")
})

export type GetRecepcionesValidDayDtoType = yup.InferType<typeof GetRecepcionesValidDayDto>;
