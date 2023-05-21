import postModel from "../../DB/schemas/post.model.js";
import likeModel from "../../DB/schemas/like.model.js";
import commentModel from "../../DB/schemas/comment.model.js";
import { populationOfLikes,populationOfAuthor,populationOfComments, postStatus, sendErrorResponse } from "../../helpers/utils.js";
import {
  convertJsonToPostModel,
  convertJsonToPostModelArray,
} from "../../helpers/response.helper.js";
import {
  allResponsesMessages,
  translateResponse,
} from "../../helpers/localizationHelper.js";

import { deletefiles, fileUpload } from "../../helpers/fileUploader.js";

//          ================================================= Add Post =================================================

export const addPost = async (req, res, next) => {
  const { title, content, status } = req.body;
  const user = req.user;

  let images = [];

  if (req.files) {
    for (const image of req.files) {
      const { secure_url, public_id } = await fileUpload(
        image.path,
        `posts/images/${user._id}`
      );
      if (!secure_url) {
        return sendErrorResponse(
          next,
          translateResponse(allResponsesMessages.FAIL_UPLOAD_PIC),
          500
        );
      }
      images.push({ secure_url, public_id });
    }
  }

  new postModel({
    title,
    content,
    author: user._id,
    images,
    status,
  })
    .save()
    .then((result) => {
      return res.status(202).json({
        data: result,
        message: translateResponse(allResponsesMessages.SUCCESS_ADD_POST),
      });
    })
    .catch((error) => {
      return sendErrorResponse(
        next,
        translateResponse(allResponsesMessages.FAIL_ADD_POST),
        500
      );
    });
};

//          ================================================= edit Post =================================================

export const editPost = async (req, res, next) => {
  const { postId, title, content, status } = req.body;
  const user = req.user;

  let images = [];

  if (req.files) {
    for (const image of req.files) {
      const { secure_url, public_id } = await fileUpload(
        image.path,
        `posts/images/${user._id}`
      );
      if (!secure_url) {
        return sendErrorResponse(
          next,
          translateResponse(allResponsesMessages.FAIL_UPLOAD_PIC),
          500
        );
      }
      images.push({ secure_url, public_id });
    }
  }

  const oldPost = await postModel
    .findByIdAndUpdate(
      { _id: postId, author: user._id },
      { title, content, status, images }
    )
    .populate(populationOfLikes)
    .populate(populationOfComments)
    .populate(populationOfAuthor)
    .lean();

  if (!oldPost) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.NOT_FOUND),
      400
    );
  }

  const isDeletedOldImagesError = await deletefiles(oldPost.images);

  if (isDeletedOldImagesError) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL_UPDATE_POST),
      500
    );
  }

  oldPost.images = images;

  return res.status(200).json({
    data: convertJsonToPostModel(oldPost),
    message: translateResponse(allResponsesMessages.SUCCESS_ADD_POST),
  });
};

//          ================================================= Delete Post =================================================
export const deletePost = async (req, res, next) => {
  const { postId } = req.body;
  const user = req.user;

  const post = await postModel.findByIdAndDelete(
    { _id: postId, createdBy: user._id },
    { new: true }
  );

  if (!post) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.NOT_FOUND),
      400
    );
  }

  await likeModel.deleteMany({ postId });
  await commentModel.deleteMany({ postId });

  return res.status(200).json({
    message: translateResponse(allResponsesMessages.SUCCESS),
  });
};

//          ================================================= get all Posts =================================================
export const getAllPosts = async (req, res, next) => {
  const posts = await postModel
    .find({ status: postStatus.PUBLIC })
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

  return res.status(200).json({
    data: convertJsonToPostModelArray(posts),
    message: translateResponse(allResponsesMessages.SUCCESS),
  });
};

//          ================================================= get Single Post Data  =================================================

export const getpost = async (req, res, next) => {
  const { postId } = req.body;
  const user = req.user;
  const posts = await postModel
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

  return res.status(200).json({
    data: convertJsonToPostModel(posts),
    message: translateResponse(allResponsesMessages.SUCCESS),
  });
};

//          ================================================= search post  =================================================

export const searchPost = async (req, res, next) => {
  const { title } = req.query;

  const post = await postModel
    .find({ title: { $regex: `${title}`, $options: "i" } })
    .populate(populationOfLikes)
    .populate(populationOfComments)
    .populate(populationOfAuthor)
    .lean();

  if (!post) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.NOT_FOUND),
      400
    );
  }

  return res.status(200).json({
    data: convertJsonToPostModelArray(post),
    message: translateResponse(allResponsesMessages.SUCCESS),
  });
};

//          ================================================= Add Like or dislike  =================================================

export const addLike = async (req, res, next) => {
  const { like, postId } = req.body;
  const user = req.user;
  let oldLike = null;

  // find if user is liked this post before
  oldLike = await likeModel.findOne({
    createdBy: user._id,
    postId,
  });

  if (like == 1) {
    if (oldLike) {
      // means user already liked this post before
      return sendErrorResponse(
        next,
        translateResponse(allResponsesMessages.ALREADY_LIKED),
        400
      );
    }
    // add new Like first
    const newLike = new likeModel({ createdBy: user._id, postId });
    newLike.save();

    const post = await postModel
      .findByIdAndUpdate(
        { _id: postId },
        {
          $addToSet: { likes: newLike._id },
        },
        { new: true }
      )
      .populate(populationOfLikes)
      .populate(populationOfComments)
      .populate(populationOfAuthor)
      .lean();

    if (!post) {
      return sendErrorResponse(
        next,
        translateResponse(allResponsesMessages.FAIL),
        400
      );
    } else {
      return res.status(200).json({
        data: convertJsonToPostModel(post),
        message: translateResponse(allResponsesMessages.SUCCESS),
      });
    }
  } else {
    // means user disLike
    if (!oldLike) {
      return sendErrorResponse(
        next,
        translateResponse(allResponsesMessages.ALREADY_NOT_LIKED),
        400
      );
    }
    // remove old like from like collection
    await likeModel.deleteOne({ _id: oldLike._id });

    const post = await postModel.findByIdAndUpdate(
      { _id: postId },
      {
        $pull: { likes: oldLike._id },
      },
      { new: true }
    );

    if (!post) {
      return sendErrorResponse(
        next,
        translateResponse(allResponsesMessages.FAIL),
        400
      );
    } else {
      return res.status(200).json({
        data: convertJsonToPostModel(post),
        message: translateResponse(allResponsesMessages.SUCCESS),
      });
    }
  }
};

//          ================================================= Add Comment =================================================

export const addComment = async (req, res, next) => {
  const { content, postId } = req.body;
  const user = req.user;

  const newComment = new commentModel({
    content,
    createdBy: user._id,
    postId,
  });
  await newComment.save();

  if (!newComment) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL_ADD_COMMENT),
      500
    );
  }

  const post = await postModel
    .findByIdAndUpdate(
      { _id: postId },
      {
        $addToSet: { comments: newComment },
      },
      { new: true }
    )
    .populate(populationOfLikes)
    .populate(populationOfComments)
    .populate(populationOfAuthor)
    .lean();

  if (!post) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL),
      400
    );
  }

  return res.status(200).json({
    data: convertJsonToPostModel(post),
    message: translateResponse(allResponsesMessages.SUCCESS),
  });
};

//          ================================================= Edit Comment =================================================
export const editComment = async (req, res, next) => {
  const { content, postId, commentId } = req.body;
  const user = req.user;

  const comment = await commentModel.findByIdAndUpdate(
    { _id: commentId, createdBy: user._id },
    {
      content,
      postId,
    },
    { new: true }
  );

  if (!comment) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.NOT_FOUND),
      400
    );
  }

  const post = await postModel
    .findById({ _id: postId })
    .populate(populationOfLikes)
    .populate(populationOfComments)
    .populate(populationOfAuthor)
    .lean();

  if (!post) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL),
      400
    );
  }

  return res.status(200).json({
    data: convertJsonToPostModel(post),
    message: translateResponse(allResponsesMessages.SUCCESS),
  });
};

//          ================================================= Delete Comment =================================================
export const deleteComment = async (req, res, next) => {
  const { postId, commentId } = req.body;
  const user = req.user;

  const comment = await commentModel.findOne({
    _id: commentId,
  });

  if (!comment) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.NOT_FOUND),
      400
    );
  }

  const post = await postModel.findOne({ _id: postId });

  if (!post) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.NOT_FOUND),
      400
    );
  }

  if (
    "" + comment.createdBy._id != user._id ||
    "" + post.author._id != user._id
  ) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.NOT_AUTHORIZED),
      400
    );
  }

  const updatedPost = await postModel
    .findByIdAndUpdate(
      { _id: postId },
      {
        $pull: { comments: commentId },
      },
      { new: true }
    )
    .populate(populationOfLikes)
    .populate(populationOfComments)
    .populate(populationOfAuthor)
    .lean();

  const deletedComment = await commentModel.deleteOne({ _id: commentId });

  if (deletedComment.modifiedCount < 0) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL),
      400
    );
  }

  if (updatedPost.modifiedCount < 0) {
    return sendErrorResponse(
      next,
      translateResponse(allResponsesMessages.FAIL),
      400
    );
  }

  return res.status(200).json({
    data: convertJsonToPostModel(updatedPost),
    message: translateResponse(allResponsesMessages.SUCCESS),
  });
};


