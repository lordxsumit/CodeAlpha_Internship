import jwt from 'jsonwebtoken';
import { user } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';

const verifyJWT =  asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
        throw new ApiError(401, "Authroization token is required")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const User = await user.findById(decodedToken?._id).select("-password")
    if(!User){
        throw new ApiError(401, "Invalid access token")
    }

    req.newUser = User;
    next();
})

export { verifyJWT }
