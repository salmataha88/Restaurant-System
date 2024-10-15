import mongoose from 'mongoose';
import { superAdmin } from '../src/modules/Admin/admin.controllers.js';
export const connectionDB = async()=> {
    return await mongoose.connect(process.env.DB_URL)
    .then((res)=> {
        console.log("DB CONNECTION SUCCESS")
        superAdmin();
    })
    .catch((err)=> console.log("DB CONNECTION FAIL" , err))
}
