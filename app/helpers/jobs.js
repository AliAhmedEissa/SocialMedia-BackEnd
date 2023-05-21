import cron from 'node-cron';
import userModel from '../DB/schemas/user.model.js';

export const removeAllDeletedUsersJob = cron.schedule('0 0 * * *', () => { 
    // delete all users where is deleted = true 
    // run every days at 12:00 am
        removeAllDeletedUsersFromDB()
  }, {
    scheduled: true,
    timezone: "Africa/Cairo" 
  });
  



  export const removeAllDeletedUsersFromDB = async () => {
        await userModel.deleteMany({isDeleted:true})
  };