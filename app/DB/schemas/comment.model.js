import mongoose,  { model, Schema } from "mongoose";
const commentSchema = new Schema(
  {
    content:String,
    
    createdBy:
     {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default : {}
      },
    ],
  },
  {
    timestamps: true,
  }
);

commentSchema.get('find'),async function(){
  const {_id} = this.getQuery()
  
} 



export const commentModel = model.User || model("Comment", commentSchema);

export default commentModel;
