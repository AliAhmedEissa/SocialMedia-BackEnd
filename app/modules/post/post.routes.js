import { Router } from "express";
const router = Router();
import * as postController from "./post.controller.js";
import { asyncHandler } from "../../helpers/errorHandler.js";
import { validation } from "../../helpers/requestValidator.js";
import { fileValidation } from "../../helpers/utils.js";
import { getUserData} from "../../middlewares/getUserData.middleware.js";
import { setLanguage } from "../../middlewares/localization.middleware.js";
import { uploadFile } from "../../services/multer.js";
import tokenAuthentication from "../../middlewares/authentication.middleware.js";
import { addPostValidation,editPostValidation, addCommentValidation,editCommentValidation,deleteCommentValidation ,likesValidation } from "./post.validation.js";


router.post("/addPost",tokenAuthentication,setLanguage,getUserData,uploadFile(fileValidation.image).array('images'),validation(addPostValidation),asyncHandler(postController.addPost)); // done 
router.delete("/deletePost",tokenAuthentication,setLanguage,getUserData,asyncHandler(postController.deletePost)); // done
router.put("/editPost",tokenAuthentication,setLanguage,getUserData,uploadFile(fileValidation.image).array('images'),validation(editPostValidation),asyncHandler(postController.editPost)); // done
router.get("/posts",tokenAuthentication,setLanguage,getUserData,asyncHandler(postController.getAllPosts)); // done
router.get("/getPost",tokenAuthentication,setLanguage,getUserData,asyncHandler(postController.getpost));// done
router.get("/searchPost",tokenAuthentication,setLanguage,getUserData,asyncHandler(postController.searchPost));// done
router.post("/addLike",tokenAuthentication,setLanguage,getUserData,validation(likesValidation),asyncHandler(postController.addLike)); // done
router.post("/addComment",tokenAuthentication,setLanguage,getUserData,validation(addCommentValidation),asyncHandler(postController.addComment)); // done
router.patch("/editComment",tokenAuthentication,setLanguage,getUserData,validation(editCommentValidation),asyncHandler(postController.editComment));
router.delete("/deleteComment",tokenAuthentication,setLanguage,getUserData,validation(deleteCommentValidation),asyncHandler(postController.deleteComment)); // done


export default router