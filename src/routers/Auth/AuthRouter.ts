import { Router } from "express";
import AuthController from "../../controllers/Auth/AuthController";
import { container } from "tsyringe";
import validateFields from "../../middlewares/validateFields";
import { LoginDto } from "../../dtos/LoginDto";
import basicAuthMiddleware from "../../middlewares/basicAuthMiddleware";
import { LoginBiometricDto } from "../../dtos/Auth/LoginBiometricDto";
import { ChangeFirstPasswordDto } from "../../dtos/Auth/ChangeFirstPasswordDto";
import { ForgotPasswordDto } from "../../dtos/Auth/ForgotPasswordDto";
import authMiddleware from "../../middlewares/authMiddleware";

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post(
  "/login",
  validateFields(LoginDto),
  authController.login.bind(authController),
);

authRouter.post(
  "/biometric",
  basicAuthMiddleware,
  validateFields(LoginBiometricDto),
  authController.loginBiometric.bind(authController),
);

authRouter.post(
  "/change-first-password",
  validateFields(ChangeFirstPasswordDto),
  authController.changeFirstPassword.bind(authController),
);

authRouter.post(
  "/forgot-password",
  validateFields(ForgotPasswordDto),
  authController.forgotPassword.bind(authController),
);

authRouter.post(
  "/upload-profile-image",
  authMiddleware,
  authController.uploadProfileImage.bind(authController),
);

export default authRouter;
