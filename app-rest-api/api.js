const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const news = require('./routes/news');

router.use(bodyParser.json());

router.use('/news', news);

router.get('/', (req, res) => {
	res.status(200).json({ message: 'Router works' });
});

module.exports = router;