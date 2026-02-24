import AuthServices from "../../services/Auth/AuthServices";
import { Request, Response } from "express";
import { JsonResponse } from "../../types/ResponseTypes";
import { injectable, inject } from "tsyringe";
import { handleSend } from "../../utils/HandlerFactory";
import { LoginDtoType } from "../../dtos/LoginDto";
import { Transaction } from "sequelize";
import { LoginBiometricDtoType } from "../../dtos/Auth/LoginBiometricDto";
import { ChangeFirstPasswordDtoType } from "../../dtos/Auth/ChangeFirstPasswordDto";
import { ForgotPasswordDtoType } from "../../dtos/Auth/ForgotPasswordDto";
import { RequestAuth } from "../../types/ResponseTypes";
import FileServices from "../../services/S3/FileServices";
import UsersRepository from "../../repositories/UsersRepository";
import { UploadedFile } from "express-fileupload";
import MsAuthService from "../../services/Auth/MsAuthService";
import {
  LinkMicrosoftDtoType,
  LoginMicrosoftDtoType,
} from "../../dtos/Auth/MicrosoftAuthDto";

@injectable()
export default class AuthController {
  constructor(
    @inject(AuthServices) private authServices: AuthServices,
    @inject(FileServices) private fileServices: FileServices,
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(MsAuthService) private msAuthService: MsAuthService,
  ) {}

  async login(req: Request, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async (t) => {
        const result = await this.authServices.validLogin(
          req.body as LoginDtoType,
          t as Transaction,
        );
        return result;
      },
      "Credenciales correctas",
      true,
      "PIOAPP",
    );
  }

  async loginBiometric(req: Request, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async (t) => {
        const result = await this.authServices.validLoginBiometric(
          req.body as LoginBiometricDtoType,
          t as Transaction,
        );
        return result;
      },
      "Login iniciado correctamente.",
      true,
      "PIOAPP",
    );
  }

  async changeFirstPassword(req: Request, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async (t) => {
        const result = await this.authServices.changeFirstPassword(
          req.body as ChangeFirstPasswordDtoType,
          t as Transaction,
        );
        return result;
      },
      "Contraseña actualizada correctamente.",
      true,
      "PIOAPP",
    );
  }

  async forgotPassword(req: Request, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async (t) => {
        const result = await this.authServices.forgotPassword(
          req.body as ForgotPasswordDtoType,
          t as Transaction,
        );
        return result;
      },
      "Contraseña restablecida correctamente.",
      true,
      "PIOAPP",
    );
  }

  async uploadProfileImage(req: RequestAuth, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async (t) => {
        const id_users = req.user?.id_users;

        if (!id_users) {
          throw new Error("Usuario no identificado.");
        }

        const file = req.files?.image_profile as UploadedFile | undefined;

        if (!file) {
          throw new Error("Agrega una imagen de perfil válida.");
        }

        const awsFile = await this.fileServices.fileUploadSingle(
          file,
          "perfiles",
        );

        const { urlS3 } = awsFile;

        await this.usersRepository.updateUser(
          Number(id_users),
          { image_profile: urlS3 as string },
          t as Transaction,
        );

        return { image_profile: urlS3 };
      },
      "Imagen de perfil actualizada correctamente.",
      true,
      "PIOAPP",
    );
  }

  async linkMicrosoftAccount(
    req: RequestAuth,
    res: Response<JsonResponse<any>>,
  ) {
    await handleSend(
      res,
      async (t) => {
        const id_users = req.user?.id_users;

        if (!id_users) {
          throw new Error("Usuario no identificado.");
        }
        console.log("req.body", req.body);
        const body = req.body as LinkMicrosoftDtoType;
        const result = await this.msAuthService.linkAccount(
          Number(id_users),
          body.ms_account_id,
          body.email_office || null,
          body.raw_data || null,
          t as Transaction,
        );

        return result;
      },
      "Cuenta de Microsoft vinculada correctamente.",
      true,
      "PIOAPP",
    );
  }

  async loginMicrosoft(req: Request, res: Response<JsonResponse<any>>) {
    await handleSend(
      res,
      async (t) => {
        const body = req.body as LoginMicrosoftDtoType;
        const result = await this.msAuthService.loginWithMicrosoft(
          body.ms_account_id,
          body.raw_data || null,
          body.id_unique_device || null,
          body.exponent_push_token || null,
          t as Transaction,
        );

        return result;
      },
      "Login con Microsoft exitoso.",
      true,
      "PIOAPP",
    );
  }
}
