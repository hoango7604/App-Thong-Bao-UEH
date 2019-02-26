const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const newsControllers = require('../controllers/news');

router.use(bodyParser.json());

router.route('/')
	.get(newsControllers.getAllNews)
	.post(newsControllers.createNews)
	.delete(newsControllers.deleteAllNews);

router.route('/:id')
	.get(newsControllers.getNews)
	.put(newsControllers.updateNews)
	.delete(newsControllers.deleteNews);

router.route('/:newsId/pushNotification')
	.get(newsControllers.pushNotificationOfNews);

module.exports = router;