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

@injectable()
export default class AuthController {
  constructor(
    @inject(AuthServices) private authServices: AuthServices,
    @inject(FileServices) private fileServices: FileServices,
    @inject(UsersRepository) private usersRepository: UsersRepository,
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
}
