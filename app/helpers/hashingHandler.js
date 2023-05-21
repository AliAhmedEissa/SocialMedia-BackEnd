import bcrypt from "bcryptjs";


export const hashPassword = (pass)=>{
   return bcrypt.hashSync(
        pass,
        parseInt(process.env.SALT_ROUNDS)
      );
}

export const compareHashedPass = (pass,passwordFromDB)=>{
    const match = bcrypt.compareSync(pass, passwordFromDB);
    return match
}


export default {hashPassword , compareHashedPass};