import Joi from "joi";

export const addPostValidation = {
    body: Joi.object()
      .required()
      .keys({
        title: Joi.string()
          .required()
          .messages({
            "any.required": "title cannot be blank",
          }),
          content: Joi.string()
          .required()
          .messages({
            "any.required": "content cannot be blank",
          }),
          status: Joi.string()
          .required()
          .messages({
            "any.required": "status cannot be blank",
          }),
      })
      .unknown(true), // for ignore other keys
  };

export const editPostValidation = {
    body: Joi.object()
      .required()
      .keys({
        postId: Joi.string()
          .required()  .messages({
            "any.required": "postId cannot be blank",
          })
         ,
        title: Joi.string()
          .optional()
         ,
          content: Joi.string()
          .optional()
          ,
          status: Joi.string()
          .optional()
          ,
          images: Joi.string()
          .optional()
          ,
      })
      .unknown(true), // for ignore other keys
  };

export const likesValidation = {
    body: Joi.object()
      .required()
      .keys({
        like: Joi.number()
          .required()
          .messages({
            "any.required": "likes cannot be blank",
          }),
        postId: Joi.string()
          .required()
          .messages({
            "any.required": "postId cannot be blank",
          }),
      })
      .unknown(true), // for ignore other keys
  };

export const addCommentValidation = {
    body: Joi.object()
      .required()
      .keys({
        content: Joi.string()
          .required()
          .messages({
            "any.required": "comment cannot be blank",
          }),
        postId: Joi.string()
          .required()
          .messages({
            "any.required": "postId cannot be blank",
          }),
      })
      .unknown(true), // for ignore other keys
  };

export const editCommentValidation = {
    body: Joi.object()
      .required()
      .keys({
        content: Joi.string()
          .required()
          .messages({
            "any.required": "comment cannot be blank",
          }),
        postId: Joi.string()
          .required()
          .messages({
            "any.required": "postId cannot be blank",
          }),
        commentId: Joi.string()
          .required()
          .messages({
            "any.required": "commentId cannot be blank",
          }),
      })
      .unknown(true), // for ignore other keys
  };

export const deleteCommentValidation = {
    body: Joi.object()
      .required()
      .keys({
        postId: Joi.string()
          .required()
          .messages({
            "any.required": "postId cannot be blank",
          }),
        commentId: Joi.string()
          .required()
          .messages({
            "any.required": "commentId cannot be blank",
          }),
      })
      .unknown(true), // for ignore other keys
  };