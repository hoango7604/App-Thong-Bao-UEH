const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const newsControllers = require('../controllers/news');
const passport = require('../utils/passport');
const { validateAdmin, validateEditorNews } = require('../utils/routeHelper');

router.use(bodyParser.json());

router.route('/')
	.get(newsControllers.getAllNews);

router.route('/editor')
	.get(
		passport.authenticate('jwt', { session: false }), 
		validateEditorNews(), 
		newsControllers.getNewsWithCondition
	)
	.post(
		passport.authenticate('jwt', { session: false }), 
		validateEditorNews(), 
		newsControllers.createPendingNews
	);

router.route('/admin')
	.get(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		newsControllers.getNewsWithCondition
	)
	.post(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		newsControllers.createNews
	)
	.delete(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		newsControllers.deleteAllNews
	);

router.route('/:id')
	.get(newsControllers.getNews);

router.route('/:id/editor')
	.put(
		passport.authenticate('jwt', { session: false }), 
		validateEditorNews(), 
		newsControllers.updateNewsEditorRole
	)
	.delete(
		passport.authenticate('jwt', { session: false }), 
		validateEditorNews(), 
		newsControllers.deleteNews
	);

router.route('/:id/admin')
	.put(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		newsControllers.updateNewsAdminRole
	)
	.delete(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		newsControllers.deleteNews
	);

router.route('/:id/admin/pushNotification')
	.post(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		newsControllers.pushNotificationOfNews
	);

module.exports = router;