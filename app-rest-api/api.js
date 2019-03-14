const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const news = require('./routes/news');
const users = require('./routes/users');

router.use(bodyParser.json());

router.use('/news', news);
router.use('/users', users);

router.get('/', (req, res) => {
	res.status(200).json({ message: 'Router works' });
});

module.exports = router;