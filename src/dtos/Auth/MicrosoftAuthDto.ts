import * as yup from "yup";

export const LinkMicrosoftDto = yup.object({
  ms_account_id: yup
    .string()
    .required("El ID de la cuenta de Microsoft es obligatorio"),
  email_office: yup.string().email("Debe ser un correo válido").nullable(),
  raw_data: yup.object().nullable(), // Para guardar la respuesta cruda de MS Graph en los logs
});

export type LinkMicrosoftDtoType = yup.InferType<typeof LinkMicrosoftDto>;

export const LoginMicrosoftDto = yup
  .object({
    ms_account_id: yup
      .string()
      .required("El ID de la cuenta de Microsoft es obligatorio"),
    raw_data: yup.object().nullable(),
    id_unique_device: yup.string().nullable(),
    exponent_push_token: yup.string().nullable(),
  })
  .test(
    "device-and-push-token",
    "id_unique_device y exponent_push_token deben enviarse juntos",
    function (values) {
      const { id_unique_device, exponent_push_token } = values ?? {};
      const hasDevice = !!id_unique_device;
      const hasToken = !!exponent_push_token;
      return hasDevice === hasToken;
    },
  );

export type LoginMicrosoftDtoType = yup.InferType<typeof LoginMicrosoftDto>;
