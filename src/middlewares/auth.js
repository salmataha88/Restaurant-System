import userModel from '../../DB/models/user.js'
import { verifyToken , generateToken} from '../utils/tokenFunctions.js'

export const isAuth = () => {
    return async (req, res, next) => {
      try {
        const { authorization } = req.headers
        if (!authorization) {
          return res.status(401).json({ message: 'Please Login First' })
        }
  
        if (!authorization.startsWith('Restaurant')) {
          return res.status(401).json({ message: 'Invalid Token prefix' })
        }
  
        const splitedToken = authorization.split(' ')[1]

        try {
          const decodedData = verifyToken({
            token: splitedToken,
            signature: process.env.SIGN_IN_TOKEN_SECRET,
          })

          const findUser = await userModel.findById(
            decodedData.id,
            'email role',
          )
          if (!findUser) {
            return next(new Error('Please SignUp', { cause: 400 }))
          }
          req.authUser = findUser

          console.log(req.authUser)

          next()

        } catch (error) {
          if (error.message === 'jwt expired') {
            // refresh token
            const user = await userModel.findOne({ token: splitedToken })
            
            if (!user) {
                return res.status(401).json({ message: 'Wrong token' })
            }
            // generate new token
            const userToken = generateToken({
              payload: {
                email: user.email,
                id: user._id,
                role: user.role,
              }
            })
  
            if (!userToken) {
              return next(
                new Error('token generation fail, payload cannot be empty', {
                  cause: 400,
                }),
              )
            }
            user.token = userToken

            console.log(userToken)

            await user.save()
            return res.status(200).json({ message: 'Token refreshed', userToken })
          }
          console.log(error)

          return res.status(500).json({ message: 'Invalid Token' })
        }
      } catch (error) {
        console.log(error)
        next()
        return res.status(500).json({ message: 'catch error in auth' })
        
      }
    }
}
