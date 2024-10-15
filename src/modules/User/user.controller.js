import userModel from '../../../DB/models/user.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../../utils/tokenFunctions.js';

export const SignUp = async (req, res, next) => {
    const { Fullname: fullname, email, mobile, password, role } = req.body;
    if (!fullname || !email || !mobile || !password) {
        return res.status(400).json({ message: 'Please fill all fields' })
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email' })
    }
    if (!/^\d{11}$/.test(mobile)) {
        return res.status(400).json({ message: 'Please enter a valid mobile number' })
    }

    var isUserExists = await userModel.findOne({ email })
    if (isUserExists) {
        return res.status(400).json({ message: 'Email is already exists' })
    }
    isUserExists = await userModel.findOne({ mobile })
    if (isUserExists) {
        return res.status(400).json({ message: 'Mobile is already exists' })
    }

    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    const user = new userModel({ 
        fullname, 
        email, 
        mobile, 
        password: hashedPassword, 
        role 
    })
    await user.save();
    res.status(201).json({ message: 'User Registered Successfully', user })
}

export const SignIn = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email)
        return res.status(400).json({ message: 'Please enter email' })
    
    if (!password) {
        return res.status(400).json({ message: 'Please fill all fields' })
    }
    
    const isUserExists = await userModel.findOne({ email })

    if (!isUserExists){
        return res.status(400).json({ message: 'Please Register first' })
    }

    const isPasswordValid = bcrypt.compareSync(password, isUserExists.password)

    if (!isPasswordValid){
        return res.status(400).json({ message: 'Invalid Password' })
    }

    const userToken = generateToken(
        {
            payload: {
                email: isUserExists.email,
                id: isUserExists._id,
                role: isUserExists.role
            },
        }
    )

    if (!userToken) {
        return res.status(400).json({ message: 'Invalid token' })
    }

    isUserExists.token = userToken
    await isUserExists.save();
    
    return res.status(200).json({ message: 'LoggedIn success', userToken })
}

export const updateUser = async (req, res, next) => {
    const { authUser } = req;
    const {userId} = req.query;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Please enter update fields' });
    }

    const user = await userModel.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (userId !== authUser.id) {
        return res.status(403).json({ message: 'You are not authorized to update this user' });
    }

    if(updates.email){
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(updates.email)) {
            return res.status(400).json({ message: 'Please enter a valid email' })
        }
        var isUserExists = await userModel.findOne({ email: updates.email })
        if (isUserExists) {
            return res.status(400).json({ message: 'Email is already exists' })
        }
    }

    if(updates.mobile){
        if (!/^\d{11}$/.test(updates.mobile)) {
            return res.status(400).json({ message: 'Please enter a valid mobile number' })
        }
        var isUserExists = await userModel.findOne({ mobile })
        if (isUserExists) {
            return res.status(400).json({ message: 'Mobile is already exists' })
        }
    }

    if (updates.password) {
        if (updates.password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        updates.password = bcrypt.hashSync(updates.password, +process.env.SALT_ROUNDS);
    }
    
    const allowedUpdates = ['fullname', 'email', 'mobile', 'password'];

    const isValidUpdate = Object.keys(updates).every(update => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(400).json({ message: 'Invalid update fields' });
    }

    const newuser = await userModel.findByIdAndUpdate(userId, updates, { new: true }).select('-__v -token');

    return res.status(200).json({ message: 'User updated successfully', newuser });
};

export const getUserById = async (req, res, next) => {
    const { authUser } = req
    const user = await userModel.findById(authUser.id)
    .select('-__v ')

    return res.status(200).json({user})
}

export const deleteUser = async (req, res, next) => {
    const { authUser } = req
    const { userId } = req.query
    const user = await userModel.findById(userId)
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (userId !== authUser.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this user' });
    }
    await userModel.findByIdAndDelete(userId)
    return res.status(200).json({ message: 'User deleted successfully' });
}