import cloudinary from "../services/cloudinary.config.js";
import { Readable } from "stream";

export const bufferUpload = async (buffer) => {
    return new Promise((resolve, reject) => {
      const writeStream = cloudinary.uploader.upload_stream((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
      const readStream = new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
      });
      readStream.pipe(writeStream);
    });
  };

export const fileUpload = async (file,folderName) => {
 return await cloudinary.uploader.upload(
  file,
  { folder: folderName }
);
  };

export const deletefiles = async (images) => {
let publicIds = []

for (let i = 0; i < images.length; i++) {
publicIds.push(images[i].public_id)
}
  let hasError = false
  for (const image of publicIds) {
   await cloudinary.uploader.destroy(image, function(error, result) {
      if (error) {
        hasError = true
      } else {
        hasError = false
      }

    });
  }
  return hasError 
  };

export const deletefile = async (image) => {
  if(image.length <= 0)  return false
  let hasError = false
  await cloudinary.uploader.destroy(image.public_id, function(error, result) {
    if (error) {
      hasError = true
    } else {
      hasError = false
    }
  });
  return hasError
}