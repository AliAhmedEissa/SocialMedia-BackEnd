import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { gender, systemRoles } from "../../helpers/utils.js";
const userSchema = new Schema(
  {
    fName: String,
    lName: String,
    phone: String,
    bio: String,
    email: {
      type: String,
      unique: true,  
    },
    pass: String,
    profile_pic: Object,
    gender: {
      type: String,
      enum :[gender.MALE,gender.FEMALE]
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: systemRoles.USER,
      enum :[systemRoles.USER,systemRoles.ADMIN,systemRoles.SUPER_ADMIN]
    },
  },
  {
    timestamps: true,
  });

  userSchema.methods.generateAuthToken = (id,_isConfirmed)=>{
    let isConfirmed = false
    if(_isConfirmed){
      isConfirmed = true
    }
    return jwt.sign({ _id:id , isConfirmed}, process.env.TOKEN_SIGNATURE) 
  }



export const userModel = model.User || model("User", userSchema);

export default userModel;
