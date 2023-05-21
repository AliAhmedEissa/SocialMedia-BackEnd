import userModel from "../../DB/schemas/user.model.js";
import {
  compareHashedPass,
  hashPassword,
} from "../../helpers/hashingHandler.js";
import { sendConfirmationMail, sendEmail } from "../../helpers/mailSender.js";
import { decodeToken } from "../../helpers/tokenHandler.js";
import { sendErrorResponse } from "../../helpers/utils.js";
import { convertJsonToUserModel } from "../../helpers/response.helper.js";
import {
  allResponsesMessages,
  translateResponse,
} from "../../helpers/localizationHelper.js";
import { fileUpload } from "../../helpers/fileUploader.js";

export const registration = async (req, res, next) => {
  const { email, fName, lName, pass, gender, phone, bio } = req.body;
  const user = req.user;
  if (!user) {
    const userWithSameName = await userModel.findOne({ fName, lName });

    if (userWithSameName) {
      return sendErrorResponse(
        next,
        translateResponse(allResponsesMessages.NAME_EXIST),
        500
      );
    }

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

    const newUser = new userModel({
      fName,
      lName,
      email,
      pass: hashPassword(pass),
      gender,
      phone,
      profile_pic: { secure_url, public_id },
      bio,
    });

    const token = newUser.generateAuthToken(
      newUser._id.toString(),
      newUser.isConfirmed
    );

    if (!token) {
      sendErrorResponse(
        next,
        translateResponse(allResponsesMessages.FAIL_GENERATE_TOKEN),
        500
      );
    }

    await sendConfirmationMail(next, req, token, email);

    await newUser.save();

    res.status(201).json({
      data: convertJsonToUserModel(newUser),
      message: translateResponse(allResponsesMessages.SUCCESS_CREATE_USER),
    });
  } else
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.USER_EXIST),
      404
    );
};

//          ================================================= Login =================================================

export const login = async (req, res, next) => {
  const { pass } = req.body;
  const user = req.user;
  if (!user) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.USER_NOT_EXIST),
      404
    );
  }

  const passwordMatch = compareHashedPass(pass, user.pass);

  if (!passwordMatch)
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.INVALID_INFO),
      400
    );

  const updatedUser = await user.updateOne(
    { _id: user._id },
    { isLoggedIn: true }
  );
  if (!updatedUser.modifiedCount)
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL_LOGIN),
      500
    );

  const token = user.generateAuthToken(user._id.toString(), user.isConfirmed);

  if (!token) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL_GENERATE_TOKEN),
      500
    );
  }

  return res.status(200).json({
    data: convertJsonToUserModel(user),
    message: translateResponse(allResponsesMessages.SUCCESS_LOGGED_IN),
    token,
  });
};

//          ================================================= Confirmation Mail =================================================

export const confirmationMail = async (req, res, next) => {
  const { token } = req.params;
  const decodedToken = decodeToken({ payload: token });
  if (!decodedToken) {
    sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL_GENERATE_TOKEN),
      500
    );
  }

  const user = await userModel.findById(
    decodedToken._id,
    decodeToken.isConfirmed
  );

  if (user.isConfirmed) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.EMAIL_ALREADY_CONFIRMED),
      404
    );
  }
  const userUpdated = await userModel.updateOne(
    { _id: decodedToken._id },
    {
      isConfirmed: true,
    }
  );
  if (userUpdated.modifiedCount) {
    return res.status(200).json({
      message: translateResponse(allResponsesMessages.SUCCESS_CONFIRM_EMAIL),
    });
  }

  return sendErrorResponse(
    next,
    translateResponse(allResponsesMessages.FAIL_CONFIRM_EMAIL),
    404
  );
};

//          ================================================= Forgot Password =================================================

export const forgotPassword = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.USER_NOT_EXIST),
      404
    );
  }

  const token = user.generateAuthToken(user.email.toString());

  if (!token) {
    sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL_GENERATE_TOKEN),
      500
    );
  }

  const confirmationLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/resetPassword/${token}`;
  const message = `<a href=${confirmationLink}>  Click To reset your password </a>`;

  await sendEmail(next, message, confirmationLink, user.email);

  return res.status(200).json({
    message: translateResponse(allResponsesMessages.SUCCESS),
  });
};

//          ================================================= reset Password =================================================

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const user = decodeToken({ payload: token });
  if (!user) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.USER_NOT_EXIST),
      404
    );
  }

  const generateNewPassword = generateRandomString();

  const updatedUser = await userModel.findOneAndUpdate(
    { email: user._id },
    { pass: hashPassword(generateNewPassword) }
  );

  if (!updatedUser) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL_UPDATE_USER),
      500
    );
  }

  return res.status(200).json({
    newPassword: generateNewPassword,
    message: translateResponse(allResponsesMessages.SUCCESS_UPDATE_POST),
  });
};

//          ================================================= Logout =================================================

export const logout = async (req, res, next) => {
  const user = req.user;
  const updatedUser = await user.updateOne(
    { _id: user._id },
    { isLoggedIn: false }
  );


  if (!updatedUser.modifiedCount)
    sendErrorResponse(next, translateResponse(allResponsesMessages.FAIL), 500);

  res
    .status(200)
    .json({ message: translateResponse(allResponsesMessages.SUCCESS) });
};

//          ================================================= Soft Delete User =================================================

// export const softDeleteUser = async (req, res, next) => {
//   const { user_id } = req.body;
//  const user =  userModel
//     .findOneAndUpdate({ _id: user_id }, { isDeleted: true })
//     .then((result) => {
//       res.status(202).json({
//         data: convertJsonToUserModel(user),
//         message: translateResponse(allResponsesMessages.SUCCESS_DELETE_USER),
//         note: translateResponse(allResponsesMessages.NOTE_DELETE_USER),
//       });
//     })
//     .catch((error) => {
//       sendErrorResponse(
//         next,
//         translateResponse(allResponsesMessages.FAIL_DELETE_USER),
//         500
//       );
//     });
// };

function generateRandomString() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
