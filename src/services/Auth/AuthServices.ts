import { injectable, inject } from "tsyringe";
import { LoginDtoType } from "../../dtos/LoginDto";
import { Transaction } from "sequelize";
import CryptServices from "./CryptServices";
import { generateToken } from "../../utils/Jwt";
import { userToken } from "../../types/ResponseTypes";
import UsersServices from "../Users/UsersServices";
import DetalleEmpleadoCootraguaViewRepository from "../../repositories/DetalleEmpleadoCootraguaViewRepository";
import TokenNotificationPushRepository from "../../repositories/TokenNotificationPushRepository";
import { LoginBiometricDtoType } from "../../dtos/Auth/LoginBiometricDto";
import UsersRepository from "../../repositories/UsersRepository";
import UsersModel from "../../models/pioapp/tables/UsersModel";
import { ChangeFirstPasswordDtoType } from "../../dtos/Auth/ChangeFirstPasswordDto";
import { ForgotPasswordDtoType } from "../../dtos/Auth/ForgotPasswordDto";

@injectable()
export default class AuthServices {
  constructor(
    // @inject(tEmpleadoRepository) private tEmpleadoRepo:tEmpleadoRepository,
    @inject(CryptServices) private cryptServices: CryptServices,
    @inject(UsersServices) private usersServices: UsersServices,
    @inject(DetalleEmpleadoCootraguaViewRepository)
    private detalleEmpleadoCootraguaViewRepository: DetalleEmpleadoCootraguaViewRepository,
    @inject(TokenNotificationPushRepository)
    private tokenNotificationPushRepository: TokenNotificationPushRepository,
    @inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async validLogin(data: LoginDtoType, t: Transaction): Promise<any | null> {
    const { exponent_push_token, id_unique_device } = data;
    const codigoEmpleado: number = Number(data.codigo.substring(2));
    // const empleado = await this.tEmpleadoRepo.findByCodigo(codigoEmpleado, true, true)
    const empleado =
      await this.detalleEmpleadoCootraguaViewRepository.findByCodigo(
        codigoEmpleado,
        true,
        true,
      );
    const user = await this.usersServices.findOrCreateUserLogin(
      codigoEmpleado,
      empleado,
      t,
      true,
    );
    //validar password
    const resultCompare = await this.cryptServices.Compare(
      data.password,
      user?.password,
    );
    if (!resultCompare) throw new Error("Contraseña incorrecta.");

    // Verificar si la contraseña es la temporal usando el campo is_temporal_password
    const isDefaultPassword = Boolean(user?.is_temporal_password);

    if (isDefaultPassword) {
      return {
        is_temporal_password: true,
        codigoEmpleado: data.codigo,
      };
    }

    // La validación de si debe cambiar su contraseña la dejamos disponible en el propio userJson para el frontend

    const { password, ...userJson } = user as any;
    //ingresar tokens "notification push" a dispositivo unico
    if (id_unique_device && exponent_push_token && user?.id_users)
      await this.tokenNotificationPushRepository.upsertTokenNotificationPush(
        id_unique_device,
        {
          id_unique_device,
          exponent_push_token,
          id_users: Number(user.id_users),
        },
        t,
      );
    const token = generateToken(userJson as userToken);
    const userData = { ...(userJson as userToken), token };
    return userData;
  }

  async validLoginBiometric(
    data: LoginBiometricDtoType,
    t: Transaction,
  ): Promise<any> {
    const { id_unique_device, exponent_push_token } = data;
    //encontrar usuario si no falla
    let user = (await this.usersRepository.findById(
      Number(data.user),
      true,
      true,
    )) as UsersModel;
    //gurdar notificaciones push en db
    if (id_unique_device && exponent_push_token && user?.id_users)
      await this.tokenNotificationPushRepository.upsertTokenNotificationPush(
        id_unique_device,
        {
          id_unique_device,
          exponent_push_token,
          id_users: Number(user.id_users),
        },
        t,
      );
    const { password, ...restUser } = user;
    const token = generateToken(restUser);
    const userPayload = { ...restUser, token };
    return userPayload;
  }

  async changeFirstPassword(
    data: ChangeFirstPasswordDtoType,
    t: Transaction,
  ): Promise<boolean> {
    const codigoEmpleado: number = Number(data.codigo.substring(2));
    const user = await this.usersRepository.findById(
      codigoEmpleado,
      true,
      true,
    );

    // Verificar que tenga la contraseña temporal
    const isDefaultPassword = Boolean(user?.is_temporal_password);

    if (!isDefaultPassword)
      throw new Error(
        "El usuario no tiene la contraseña temporal o ya la cambió.",
      );

    // Hashear la nueva contraseña y actualizar
    const newPasswordHash = await this.cryptServices.Hash(data.newPassword);
    const result = await this.usersRepository.updateUser(
      codigoEmpleado,
      { password: newPasswordHash, is_temporal_password: false },
      t,
    );
    return result;
  }

  async forgotPassword(
    data: ForgotPasswordDtoType,
    t: Transaction,
  ): Promise<boolean> {
    const codigoEmpleado: number = Number(data.codigo.substring(2));

    // Buscar el empleado en NOMINA
    const empleado =
      await this.detalleEmpleadoCootraguaViewRepository.findByCodigo(
        codigoEmpleado,
        true,
        true,
      );
    // Validar DPI y Fecha de Nacimiento
    if (
      empleado?.noDoc !== data.dpi ||
      empleado?.fechaNac_2 !== data.fechaNacimiento
    ) {
      throw new Error(
        "Los datos ingresados no coinciden con los registros de empleado.",
      );
    }

    // Buscar el usuario en PIOAPP
    const user = await this.usersRepository.findById(
      codigoEmpleado,
      true,
      true,
    );
    if (!user) {
      throw new Error("Usuario no encontrado en la aplicación.");
    }

    // Hashear la nueva contraseña y actualizar
    const newPasswordHash = await this.cryptServices.Hash(data.newPassword);
    const result = await this.usersRepository.updateUser(
      codigoEmpleado,
      { password: newPasswordHash },
      t,
    );
    return result;
  }
}
