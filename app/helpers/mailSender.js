import { sendMail } from "../services/mailServices.js";
import { allResponsesMessages, translateResponse } from "./localizationHelper.js";

export const sendConfirmationMail = async (next,req,token,to) => {
    
    const confirmationLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/mailConfirmation/${token}`;
    const message = `<a href=${confirmationLink}>  Click To Confirm Email </a>`;
    
    const sentEmail = await sendMail({
        to,
        message,
        subject: "Email Confirmation",
      });

      if (!sentEmail) {
       return sendErrorResponse(next,translateResponse(allResponsesMessages.FAIL_SEND_EMAIL),500)
      } 
      return true
}

export const sendEmail = async (next,message,subject,to) => {
        
    const sentEmail = await sendMail({
        to,
        message,
        subject,
      });

      if (!sentEmail) {
        sendErrorResponse(next,translateResponse(allResponsesMessages.FAIL_SEND_EMAIL),500)
      } 
      return true

}


