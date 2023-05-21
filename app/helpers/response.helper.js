import { formateDate } from "./utils.js";

export function convertJsonToUserModel(json) {
    const { _id,fName, lName,role, gender,email,phone,isConfirmed,profile_pic } = json;
    return new User(_id,fName, lName,role,gender,email,phone,isConfirmed,profile_pic);
  }

 function convertJsonToCustomUserModel(json) {
    const { _id,fName, lName,profile_pic } = json;
    return new User(_id,fName, lName,null,null,null,null,null,profile_pic);
  }

 function convertJsonToLikeModel(json) {
  let allLikes = []
  for(let i = 0; i < json.length; i++) {
    let obj = json[i];
    const { _id,createdBy,createdAt} = obj;
    const user = convertJsonToCustomUserModel(createdBy)
    allLikes.push( new Like(_id,user,formateDate(createdAt)))
  }
  return allLikes
  }

 function convertJsonToCommentModel(json) {
  let allComments = []
  for(let i = 0; i < json.length; i++) {
    const obj = json[i];
    const { _id,createdBy,createdAt,content} = obj;
    const user = convertJsonToCustomUserModel(createdBy)
    allComments.push( new Comment(_id,user,content,formateDate(createdAt)))
  }
  return allComments
  }

export function convertJsonToPostModelArray(json) {
  let posts =[]
  for(let i = 0; i < json.length; i++) {
    const obj = json[i];
    const author = convertJsonToCustomUserModel(obj)
    const allLike = convertJsonToLikeModel(obj.likes)
    const allComment = convertJsonToCommentModel(obj.comments)
    const { _id,status, title,content, images,createdAt} = obj;
    const post = new Post(_id,status,author,title,content, images,formateDate(createdAt),
    allLike,
    allLike.length ,
    allComment)
    posts.push(post)
  }

      return posts
  }

export function convertJsonToPostModel(json) {
    const author = convertJsonToCustomUserModel(json.author)
    const allLike = convertJsonToLikeModel(json.likes)
    const allComment = convertJsonToCommentModel(json.comments)
    const { _id,status, title,content, images,createdAt} = json;
    const post = new Post(_id,status,author,title,content, images,formateDate(createdAt),
    allLike,
    allLike.length,
    allComment)
      return post
  }










  /*
{
  "data": {
    "status": "public",
    "_id": "64271e9eebf62c6c6d3ed11c",
    "title": "aaaaaaaaa",
    "content": "ahmed",
    "images": [],
    "author": "6426ff831fcf91de7505d85e",
    "likes": [
      {
        "_id": "64275041e48b908dd6bf2c2e",
        "createdBy": {
          "_id": "6426ff831fcf91de7505d85e",
          "phone": "123456789",
          "email": "alieasa806@gmail.com",
          "pass": "$2a$08$qykEuJ3KXV6IYrmBEVMiouNTbL7/jZpdCByo5us2GQAGiF.ZsQn.y",
          "profile_pic": {
            "secure_url": "https://res.cloudinary.com/dr5jkkbtx/image/upload/v1680277380/user/profile/a/ybphaoqzjglicoqe1eap.png",
            "public_id": "user/profile/a/ybphaoqzjglicoqe1eap"
          },
          "gender": "male",
          "isConfirmed": true,
          "isLoggedIn": false,
          "isDeleted": false,
          "role": "user",
          "createdAt": "2023-03-31T15:43:01.671Z",
          "updatedAt": "2023-03-31T18:43:14.424Z",
          "__v": 0
        },
        "postId": [
          "64271e9eebf62c6c6d3ed11c"
        ],
        "createdAt": "2023-03-31T21:27:29.806Z",
        "updatedAt": "2023-03-31T21:27:29.806Z",
        "__v": 0
      }
    ],
    "comments": [
      {
        "_id": "64275030e48b908dd6bf2c29",
        "content": "sjsjsjsjjsjs",
        "createdBy": "6426ff831fcf91de7505d85e",
        "postId": [
          "64271e9eebf62c6c6d3ed11c"
        ],
        "createdAt": "2023-03-31T21:27:12.445Z",
        "updatedAt": "2023-03-31T21:27:12.445Z",
        "__v": 0
      }
    ],
    "createdAt": "2023-03-31T17:55:42.088Z",
    "updatedAt": "2023-03-31T21:27:29.806Z",
    "__v": 0
  },
  "message": "success"
}
  */






  class User {
    constructor(_id,fName, lName, role,gender,email,phone,isConfirmed,profile_pic) {
        this._id = _id||"";
        this.fName = fName ||"" ;
        this.lName = lName ||"";
        this.role = role||"";
        this.gender = gender||"";
        this.email = email||"";
        this.phone = phone||"";
        this.isConfirmed = isConfirmed||"";
        this.profile_pic = profile_pic||"";
      }
  }

  class Post {
    constructor(_id,status,author,title,content,images,createdAt,likes,likesCount,comments) {
        this._id = _id;
        this.status = status;
        this.title = title;
        this.content = content;
        this.images = images;
        this.likes = likes;
        this.comments = comments;
        this.createdAt = createdAt;
        this.likesCount = likesCount;
        this.author = author;
      }
  }

  class Comment {
    constructor(_id,user,content,createdAt) {
        this._id = _id;
        this.user = user;
        this.content = content;
        this.createdAt = createdAt;
      }
  }

  class Like {
    constructor(_id,user,createdAt) {
        this._id = _id;
        this.user = user;
        this.createdAt = createdAt;
      }
  }

