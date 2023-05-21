import { sendErrorResponse } from "../helpers/utils.js";

export const authorization = (accessRole)=> async (req, res, next) => {
    const {role} = req.user
    if(!accessRole.includes(role)){
    return sendErrorResponse(next, "Un-Authorized", 403);
    }else next()

}