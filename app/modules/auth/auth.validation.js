import Joi from "joi";

export const signUpValidatinon = {
  body: Joi.object()
    .required()
    .keys({
      fName: Joi.string().min(3).max(10).alphanum().messages({
        "string.min": "first Name must contain at least 3 charachters",
        "any.required": "please enter your First Name",
      }),
      lName: Joi.string().min(3).max(10).alphanum().messages({
        "string.min": "last Name must contain at least 3 charachters",
        "any.required": "please enter your Last Name",
      }),
      email: Joi.string()
        .email()
        .required()
        .messages({
          "string.email": "Email format in-valid",
          "any.required": "please enter your email",
        }),
      pass: Joi.string().required().min(5).max(10).messages({
        "string.min": "password must contain at least 5 charachters",
      }),
      cPass: Joi.string().required().valid(Joi.ref("pass")).messages({
        "any.only": "confirmation password must match password",
        "any.required": "please enter your confirmation password",
      }),
      gender: Joi.string().required().messages({
        "any.required": "please enter your gender"
      }),
      phone: Joi.string().required().messages({
        "any.required": "please enter your phone number"
      }),
      bio: Joi.string().optional().messages({
        "any.required": "please enter your phone number"
      }),
    }).unknown(true), 
};

export const loginValidation = {
  body: Joi.object()
    .required()
    .keys({
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "string.email": "Email format in-valid",
          "any.required": "email cannot be blank",
        }),
      pass: Joi.string().required().min(5).max(10).messages({
        "string.min": "password must contain at least 5 charachters",
      }),
    })
    .unknown(true), // for ignore other keys
};


export const forgotPasswordValidation = {
  body: Joi.object()
    .required()
    .keys({
        email: Joi.string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "string.email": "Email format in-valid",
          "any.required": "email cannot be blank",
        }),
    }).unknown(true), 
};


export const updateValidatinon = {
  body: Joi.object()
    .required()
    .keys({
      name: Joi.string()
        .min(5)
        .max(10)
        .alphanum()
        .messages({
          "string.min": "Username must contain at least 5 charachters",
        })
        .optional(),
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net"] }, minDomainSegments: 2 })
        .optional()
        .messages({
          "string.email": "Email format in-valid",
          "any.required": "please enter your email",
        })
        .optional(),
      pass: Joi.string()
        .optional()
        .min(5)
        .max(10)
        .messages({
          "string.min": "password must contain at least 5 charachters",
        }),
      cpass: Joi.string()
        .optional()
        .min(5)
        .max(10)
        .messages({
          "string.min": "password must contain at least 5 charachters",
        })
        .optional(),
      phone: Joi.string().optional(),
    })
    .unknown(true), // for ignore other keys ,
};
