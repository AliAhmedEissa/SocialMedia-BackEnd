import userModel from "../../DB/schemas/user.model.js";
import postModel from "../../DB/schemas/post.model.js";
import {
  compareHashedPass,
  hashPassword,
} from "../../helpers/hashingHandler.js";
import { convertJsonToPostModelArray, convertJsonToUserModel } from "../../helpers/response.helper.js";
import {
  allResponsesMessages,
  translateResponse,
} from "../../helpers/localizationHelper.js";
import { fileUpload, deletefile } from "../../helpers/fileUploader.js";
import { populationOfLikes,populationOfAuthor,populationOfComments, sendErrorResponse } from "../../helpers/utils.js";

//          ================================================= get Profile Data =================================================

export const getProfileData = async (req, res, next) => {
  const user = req.user;

  const posts = await postModel
  .find({author: user._id})
  .populate(populationOfLikes)
  .populate(populationOfComments)
  .populate(populationOfAuthor)
  .lean();

if (!posts) {
  return sendErrorResponse(
    next,
    translateResponse(allResponsesMessages.NOT_FOUND),
    400
  );
}


if (posts.length<=0) {
  return res.status(200).json({
    message: translateResponse(allResponsesMessages.FAIL_SEARCH_POST),
  });
}

return res.status(200).json({
  data: convertJsonToPostModelArray(posts),
  message: translateResponse(allResponsesMessages.SUCCESS),
});

};

//          ================================================= Update Profile Pic =================================================

export const updateProfilePic = async (req, res, next) => {
  const user = req.user;

  const { secure_url, public_id } = await fileUpload(
    req.file.path,
    `user/profile/a`
  );

  if (!secure_url)
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL_UPLOAD_PIC),
      500
    );

  const updatedUser = await userModel
    .findByIdAndUpdate(
      { _id: user._id },
      { profile_pic: { secure_url, public_id } }
    )
    .lean();

  if (!updatedUser) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.NOT_FOUND),
      500
    );
  }

  const isOldImageDeletedError = await deletefile(updatedUser.profile_pic);

  if (isOldImageDeletedError) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL),
      500
    );
  }

  updatedUser.profile_pic = { secure_url, public_id };
  return res.status(202).json({
    data: convertJsonToUserModel(updatedUser),
    message: translateResponse(allResponsesMessages.SUCCESS_UPDATE_USER),
  });
};

//          ================================================= Update Profile =================================================

export const updateProfileData = async (req, res, next) => {
  const { fName, lName, phone, bio } = req.body;
  const user = req.user;

  const userWithSameName = await userModel.findOne({ fName, lName });

  if (userWithSameName) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.NAME_EXIST),
      500
    );
  }

  userModel
    .updateOne({ _id: user._id }, { fName, lName, phone, bio }, { new: true })
    .then((result) => {
      res.status(202).json({
        data: convertJsonToUserModel(user),
        message: translateResponse(allResponsesMessages.SUCCESS_UPDATE_USER),
      });
    })
    .catch((error) => {
      sendErrorResponse(
        next,
        translateResponse(allResponsesMessages.FAIL_UPDATE_USER),
        500
      );
    });
};

//          ================================================= Change password =================================================

export const changePassword = async (req, res, next) => {
  const { newPass, oldPass } = req.body;

  const user = req.user;

  if (!compareHashedPass(oldPass, user.pass))
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL_PASS_MATCHING),
      400
    );

  userModel
    .updateOne({ _id: user._id }, { pass: hashPassword(newPass) })
    .then((result) => {
      res.status(202).json({
        data: convertJsonToUserModel(user),
        message: translateResponse(allResponsesMessages.SUCCESS_UPDATE_USER),
      });
    })
    .catch((error) => {
      sendErrorResponse(
        next,
        translateResponse(allResponsesMessages.FAIL_UPDATE_USER),
        500
      );
    });
};
