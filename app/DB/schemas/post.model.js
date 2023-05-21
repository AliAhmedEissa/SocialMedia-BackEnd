import mongoose,  { model, Schema } from "mongoose";
import { postStatus } from "../../helpers/utils.js";
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images:{
      type: [Object],
    } ,
    author:
     {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
        default : {}
      },
    ],
    likesCount: 
      {
        type: Number,
      },
    
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default : {}
      },
    ],

    status: 
    {
      type: String,
      default: postStatus.PUBLIC,
      enum :[postStatus.PUBLIC,postStatus.PRIVATE]
   },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ title: 'text' });
postSchema.get('find'),async function(){
  const {_id} = this.getQuery()
  
} 



export const postModel = model.User || model("Post", postSchema);

export default postModel;
