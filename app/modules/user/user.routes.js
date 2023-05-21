import { Router } from "express";
const router = Router();
import * as userController from "./user.controller.js";
import { asyncHandler } from "../../helpers/errorHandler.js";
import { validation } from "../../helpers/requestValidator.js";
import { fileValidation } from "../../helpers/utils.js";
import { getUserData} from "../../middlewares/getUserData.middleware.js";
import { setLanguage } from "../../middlewares/localization.middleware.js";
import { uploadFile } from "../../services/multer.js";
import tokenAuthentication from "../../middlewares/authentication.middleware.js";
import { changePasswordValidation,changeProfilePicValidation,updateProfileValidation } from "./user.validation.js";

router.get("/profile",tokenAuthentication,setLanguage,getUserData,asyncHandler(userController.getProfileData)); // done
router.patch("/updateProfilePic",tokenAuthentication,setLanguage,getUserData,uploadFile(fileValidation.image).single('image'),asyncHandler(userController.updateProfilePic)); // done
router.patch("/changePassword",tokenAuthentication,setLanguage,getUserData,validation(changePasswordValidation),asyncHandler(userController.changePassword));// done
router.put("/updateProfileData",tokenAuthentication,setLanguage,getUserData,validation(updateProfileValidation),asyncHandler(userController.updateProfileData)); //done

export default router