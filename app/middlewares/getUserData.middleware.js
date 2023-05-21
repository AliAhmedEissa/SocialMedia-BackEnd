import { userModel } from "../DB/schemas/user.model.js";
import { sendErrorResponse } from "../helpers/utils.js";


export const getUserData = async (req, res,next) => {
  try {
    const _id = req.user_id;
    const user =  await userModel.findById({ _id}); 
    if (user) {
      req.user = user;
      next()
    }else {
        sendErrorResponse(next, "in-valid information", 400);
    }
  } catch (error) {
    sendErrorResponse(next, error.message);

  }
};

export const getUserDataByEmail = async (req, res,next) => {
  try {
    
    const {email} = req.body;
    if (!email) {
      sendErrorResponse(next,"email is required");
    }
    const user =  await userModel.findOne({ email })
    req.user = user
    next()
  } catch (error) {
    sendErrorResponse(next, error.message);
  }
};






export default {getUserData,getUserDataByEmail} ;
