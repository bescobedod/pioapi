import * as yup from "yup";

export const ChangeFirstPasswordDto = yup.object({
  codigo: yup
    .string()
    .matches(
      /^[a-zA-Z]{2}\d+$/,
      "el [codigo] debe empezar con 2 letras y luego numeros.",
    )
    .required("el [codigo] es un campo obligatorio"),
  newPassword: yup
    .string()
    .required("el [newPassword] es un campo obligatorio"),
});

export type ChangeFirstPasswordDtoType = yup.InferType<
  typeof ChangeFirstPasswordDto
>;
