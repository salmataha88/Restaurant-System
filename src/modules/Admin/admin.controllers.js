import bcrybt from 'bcrypt';
import User from '../../../DB/models/user.js';

export const superAdmin = async (req, res, next) => {
    const superAdminExists = await User.findOne({ fullname: 'Super Admin' });
    
    if (!superAdminExists) {
        const password = bcrybt.hashSync(process.env.SuperAdminPassword , +process.env.SALT_ROUNDS);
        const superAdmin = new User({
            fullname: process.env.SuperAdminName,
            password: password,
            email: process.env.SuperAdminEmail,
            mobile: '01000000000',
            role: 'Admin',
        });

        await superAdmin.save();
        console.log('Super Admin is created');
    } else {
        console.log('Super Admin exists');
    }
}

export const addAdmin = async (req, res, next) => {
    const {fullname, password, email , mobile} = req.body;
    if (!fullname || !password || !email || !mobile) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email' })
    }
    if (!/^\d{11}$/.test(mobile)) {
        return res.status(400).json({ message: 'Please enter a valid mobile number' })
    }
    
    const adminExists = await User.findOne({ email });
    if (adminExists) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = bcrybt.hashSync(password, +process.env.SALT_ROUNDS);
    const admin = new User({
        fullname,
        password: hashedPassword,
        email,
        mobile,
        role : 'Admin'
    });
    await admin.save();
    return res.status(200).json({ message: 'Admin account created' , admin });
}

export const getAllAdmins = async (req, res, next) => {
    const admins = await User.find({ role: 'Admin', fullname: { $ne: 'Super Admin' } });
    return res.status(200).json({ admins });
}

export const deleteAdmin = async (req, res, next) => {
    const { adminId } = req.query;
    if (!adminId) {
        return res.status(400).json({ message: 'Please enter admin id' });
    }
    const admin = await User.findById(adminId);
    if (!admin) {
        return res.status(400).json({ message: 'Admin not found' });
    }
    await admin.deleteOne();
    return res.status(200).json({ message: 'Admin deleted successfully' });
}