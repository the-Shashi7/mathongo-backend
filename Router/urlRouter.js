const express  = require('express');
const urlRouter = express.Router();
const rateLimit = require('../Middleware/rateLimiting');
const {shortUrl,getShortUrl} = require('../Controller/urlController');

urlRouter.post('/',rateLimit,shortUrl);
urlRouter.get('/:shortUrl',getShortUrl);

module.exports = urlRouter;