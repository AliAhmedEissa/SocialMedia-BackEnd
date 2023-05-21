import cloudinary from 'cloudinary'
// import { config } from "dotenv";
// config();
// Configuration 
cloudinary.v2.config({
  cloud_name: "dr5jkkbtx",
  api_key: "231714346585761",
  api_secret: "ORZfGGEjuSfkpYcrwP6-JAVeCJc",
  secure:true
});



export default cloudinary.v2