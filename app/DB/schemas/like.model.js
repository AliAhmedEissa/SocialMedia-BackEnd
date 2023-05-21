import mongoose,  { model, Schema } from "mongoose";
const likeSchema = new Schema(
  {
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

likeSchema.get('find'),async function(){
  const {_id} = this.getQuery()
  
} 



export const likeModel = model.User || model("Like", likeSchema);

export default likeModel;
