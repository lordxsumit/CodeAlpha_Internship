import express from 'express';
import { createShortUrl, redirectToUrl } from '../controllers/url.controller.js';

const router = express.Router();

// API: create short url
router.post('/api/create-short-url', createShortUrl);

// Redirect by short code
router.get('/:code', redirectToUrl);

export default router;