import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { Url } from '../models/url.model.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER = '0123456789';

function generateShortCode(length = 3) {
	let result = '';
	for (let i = 1; i <= length; i++) {
		result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)] + NUMBER[Math.floor(Math.random() * NUMBER.length)]
	}
	return result
}


const createShortUrl = async (req, res) => {
	try {
		const { originalUrl } = req.body;

		if (!originalUrl) return new ApiError(400, "Original URL is required")

		// generate unique short code
		let shortCode = generateShortCode();
		while (await Url.findOne({ shortCode })) {
			shortCode = generateShortCode();
		}

		const url = new Url({ shortCode, originalUrl });
		await url.save();

		const base = `http://localhost:${process.env.PORT || 3000}`;

		return res
        .status(201)
        .json(
            new ApiResponse(
				201,
				{
					shortCode: `${base}/${shortCode}`,
					shortCode,
					originalUrl
				}
			)
        )

	} catch(err){
		// console.error(err);
		return res
        .status(500)
        .json(
            new ApiResponse(500, err?.message, "Server error")
        );
	}
};

const redirectToUrl = asyncHandler(async (req, res) => {
	try {
		const { code } = req.params;
		const url = await Url.findOne({ shortCode: code });

		if (!url) return new ApiError(404, "URL shortcode not found")

		url.clicks = (url.clicks || 0) + 1;
		await url.save();

		return res.redirect(url.originalUrl);
        
	} catch(err){
		return res
        .status(500)
        .json(
			new ApiResponse(500, err?.message, "Server error")
		);
	}
});


export {
    createShortUrl,
    redirectToUrl
}
