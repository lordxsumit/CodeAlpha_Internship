import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Organizer } from "../models/organizer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const verifyOrganizer = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : "";

    if (!token) {
        throw new ApiError(401, "Authorization token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const organizer = await Organizer.findById(decoded?._id).select("-password");
    if (!organizer) {
        throw new ApiError(401, "Organizer not found");
    }

    req.organizer = organizer;
    next();
});


const verifyJWT = asyncHandler(async (req, res, next) => {
    const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!Token){
        throw new ApiError(401, "Authorization token is required")
    }

    const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password")
    if(!user){
        throw new ApiError(401, "Invalid access token")
    }

    req.newUser = user;
    next();
})


export {
    verifyOrganizer,
    verifyJWT
};
