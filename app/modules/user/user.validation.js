import Joi from "joi";

export const changePasswordValidation = {
    body: Joi.object()
      .required()
      .keys({
        oldPass: Joi.string().required().min(5).max(10).messages({
            "string.min": "password must contain at least 5 charachters",
            "any.required": "please enter your old password",

          }),
        newPass: Joi.string().required().min(5).max(10).messages({
            "string.min": "password must contain at least 5 charachters",
            "any.required": "please enter your new password",
          }),
          cPass: Joi.string().required().valid(Joi.ref("newPass")).messages({
            "any.only": "confirmation password must match new password",
            "any.required": "please enter your cPassword ",
          }),
      })
      .unknown(true), // for ignore other keys
  };

export const updateProfileValidation = {
    body: Joi.object()
      .required()
      .keys({
        fName: Joi.string().required().min(3).max(10).messages({
            "string.min": "password must contain at least 3 charachters",
            "any.required": "please enter your old password",

          }),
        lName: Joi.string().required().min(3).max(10).messages({
            "string.min": "password must contain at least 3 charachters",
            "any.required": "please enter your old password",
          }),
        bio: Joi.string().required().min(3).max(10).messages({
            "string.min": "password must contain at least 3 charachters",
            "any.required": "please enter your old password",
          }),
        phone: Joi.string().required().min(3).max(10).messages({
            "string.min": "password must contain at least 3 charachters",
            "any.required": "please enter your old password",
          }),
      
      })
      .unknown(true), // for ignore other keys
  };

export const changeProfilePicValidation = {
    body: Joi.object()
      .required()
      .keys({
        image: Joi.string()
          .required()
          .messages({
            "any.required": "image cannot be blank",
          }),
    
      })
      .unknown(true), // for ignore other keys
  };