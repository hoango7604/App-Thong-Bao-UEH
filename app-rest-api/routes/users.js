const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const usersControllers = require('../controllers/users');
const passport = require('../utils/passport');
const { validateAdmin, validateEditorNews } = require('../utils/routeHelper');

router.use(bodyParser.json());

router.route('/signIn')
	.post(
		passport.authenticate('local', { session: false }),
		usersControllers.signIn
	);

router.route('/admin')
	.get(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		usersControllers.getAllUsers
	)
	.post(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		usersControllers.createUser
	)
	.delete(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		usersControllers.deleteAllUsers
	);

router.route('/:id/editor')
	.get(
		passport.authenticate('jwt', { session: false }), 
		validateEditorNews(), 
		usersControllers.getUser
	)
	.put(
		passport.authenticate('jwt', { session: false }), 
		validateEditorNews(), 
		usersControllers.updateUser
	);

router.route('/:id/admin')
	.get(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		usersControllers.getUser
	)
	.put(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		usersControllers.updateUser
	)
	.delete(
		passport.authenticate('jwt', { session: false }), 
		validateAdmin(), 
		usersControllers.deleteUser
	);

router.route('/changePassword')
	.post(
		passport.authenticate('jwt', { session: false }),
		usersControllers.changePassword
	);

module.exports = router;