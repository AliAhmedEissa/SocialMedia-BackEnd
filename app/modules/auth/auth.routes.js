import { Router } from "express";
import { asyncHandler } from "../../helpers/errorHandler.js";
import { getUserData, getUserDataByEmail } from "../../middlewares/getUserData.middleware.js";
import { authorization } from "../../middlewares/authorization.middleware.js";
import {signUpValidatinon,loginValidation,forgotPasswordValidation} from "./auth.validation.js";
import * as authController from "./auth.controller.js";
import { validation } from "../../helpers/requestValidator.js";
import { appRoles } from "../../helpers/roles.js";
import { setLanguage } from "../../middlewares/localization.middleware.js";
import { uploadFile } from "../../services/multer.js";
import { fileValidation } from "../../helpers/utils.js";
import tokenAuthentication from "../../middlewares/authentication.middleware.js";
const router = Router();

router.post("/signUp",uploadFile(fileValidation.image).single('image'),validation(signUpValidation),setLanguage,getUserDataByEmail,asyncHandler(authController.registration)); // done
router.post("/login",validation(loginValidation),setLanguage,getUserDataByEmail, asyncHandler(authController.login)); // done
router.post("/logout",tokenAuthentication,setLanguage,getUserData, asyncHandler(authController.logout));
router.get( "/mailConfirmation/:token", asyncHandler(authController.confirmationMail)); // done
router.post("/forgotPassword",setLanguage, validation(forgotPasswordValidation),getUserDataByEmail,asyncHandler(authController.forgotPassword)); // done
router.get("/resetPassword/:token",setLanguage,asyncHandler(authController.resetPassword)); // done
//router.post("/softDeleteUser",tokenAuthentication,setLanguage,getUserData,authorization(appRoles.SOFT_DELETE),asyncHandler(authController.softDeleteUser));  // done

export default router;
