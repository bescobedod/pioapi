import { injectable, inject } from "tsyringe";
import { Transaction } from "sequelize";
import UsersModel from "../../models/pioapp/tables/UsersModel";
import UsersRepository from "../../repositories/UsersRepository";
import LogsAuthMicrosoftModel from "../../models/pioapp/tables/LogsAuthMicrosoftModel";
import { generateToken } from "../../utils/Jwt";
import { JsonResponse } from "../../types/ResponseTypes";
import TokenNotificationPushRepository from "../../repositories/TokenNotificationPushRepository";
import AuthServices from "./AuthServices";

@injectable()
export default class MsAuthService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(TokenNotificationPushRepository)
    private tokenNotificationPushRepository: TokenNotificationPushRepository,
    @inject(AuthServices) private authServices: AuthServices,
  ) {}

  // Middleware/helper para guardar el log de MS
  async logAttempt(
    action: "LOGIN" | "LINK_ACCOUNT" | "API_ERROR",
    status: boolean,
    requestData: any,
    idUser: number | null = null,
    errorMessage: string | null = null,
    t: Transaction | null = null,
  ) {
    await LogsAuthMicrosoftModel.create(
      {
        action,
        status,
        request_data: requestData,
        id_user: idUser,
        error_message: errorMessage,
      },
      { transaction: t },
    );
  }

  // 1. Vincular la cuenta (Requiere que el usuario ya esté autenticado por JWT en PioApp)
  async linkAccount(
    userId: number,
    msAccountId: string,
    emailOffice: string | null,
    rawData: any, // Datos crudos recibidos desde la app móvil para guardarlos en log
    t: Transaction,
  ): Promise<JsonResponse<any>> {
    try {
      // Validar si el MS Account ID ya está siendo usado por otro empleado
      const existingLink = await UsersModel.findOne({
        where: { ms_account_id: msAccountId },
        transaction: t,
      });

      if (existingLink && existingLink.id_users !== BigInt(userId)) {
        throw new Error(
          "Esta cuenta de Microsoft ya está vinculada a otro empleado.",
        );
      }

      await this.usersRepository.updateUser(
        userId,
        {
          ms_account_id: msAccountId,
          email_office: emailOffice,
        },
        t,
      );

      await this.logAttempt("LINK_ACCOUNT", true, rawData, userId, null, t);

      return {
        status: true,
        message: "Cuenta vinculada exitosamente",
        data: null,
      };
    } catch (error: any) {
      await this.logAttempt(
        "LINK_ACCOUNT",
        false,
        rawData,
        userId,
        error.message,
        t,
      );
      throw error;
    }
  }

  // 2. Iniciar sesión utilizando el MS Account ID
  async loginWithMicrosoft(
    msAccountId: string,
    rawData: any,
    idDevice: string | null = null,
    exponentPushToken: string | null = null,
    t: Transaction,
  ): Promise<JsonResponse<any>> {
    let idUserAttempt: number | null = null;
    try {
      // Buscar usuario por el ID de Microsoft
      const userRaw = await UsersModel.findOne({
        where: { ms_account_id: msAccountId },
        transaction: t,
        raw: true,
      });

      if (!userRaw) {
        throw new Error(
          "No hay ninguna cuenta de PioApp vinculada a este usuario de Microsoft.",
        );
      }

      idUserAttempt = Number(userRaw.id_users);

      if (userRaw.baja) {
        throw new Error("El usuario se encuentra dado de baja.");
      }

      // Re-fetch using repository to match exact validLogin behavior and raw settings
      const user = (await this.usersRepository.findById(
        idUserAttempt,
        true,
        true,
      )) as UsersModel;

      await this.logAttempt("LOGIN", true, rawData, idUserAttempt, null, t);

      return await this.authServices.generateUserPayload(
        user,
        idDevice,
        exponentPushToken,
        t,
      );
    } catch (error: any) {
      await this.logAttempt(
        "LOGIN",
        false,
        rawData,
        idUserAttempt,
        error.message,
        t,
      );
      throw error;
    }
  }
}
