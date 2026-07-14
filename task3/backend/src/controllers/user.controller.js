import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { user } from '../models/user.model.js';


const generateAccessAndRefreshToken = async (userID) => {
    try{
        const newUser = await user.findById(userID)
        const accessToken = newUser.generateAccessToken()
        const refreshToken = newUser.generateRefreshToken()

        console.log("AccessToken : ", accessToken)
        console.log("RefreshToken : ", refreshToken)

        newUser.refreshToken = refreshToken
        await newUser.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, } = req.body;
    if(
        [username, email].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await user.findOne({
        $or: [username, email]
    })
    if(existedUser){
        throw new ApiError(400, "User already exists")
    }

    const User = await user.create({
        username: username.lowercase(),
        email,
        password
    })

    const createdUser = await user.findById(User._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdUser, "User successfully registered")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    if(
        [username, email].some((fields) => fields?.trim() === "")
    ){
        throw new ApiError("Username and Email are required")
    }

    const User = await user.findOne({
        $or: [username, email]
    })
    if(!User){
        throw new ApiError(404, "User does'nt exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(User._id)

    const loggedInUser = await user.findById(User._id).select("-password -refreshToken")

    // This line resolve's the problem of cookies not showing in the cookie tab in the postman while testing. (This fix was found through searching for fixes on perplexity)
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loggedInUser, "User was logged in successfully")
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    await user.findByIdAndUpdate(
        req.newUser._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User was logged out successfully")
    )
})



export {
    registerUser, 
    loginUser,
    logoutUser
}
