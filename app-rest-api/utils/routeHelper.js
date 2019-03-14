const { ROLES } = require('../utils/types');

module.exports = {
	/**
	 * Editor authentication:
	 * --- This occurs after passport jwt authentication ---
	 * authorId must be the same with sub field (id) included in jwt token
	 * authorId: req.body.authorId
	 * id: req.user.id
	 */
	validateEditorNews: () => {
		return (req, res, next) => {
			if (!req.body.authorId || req.body.authorId !== req.user.id) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			next();
		}
	},

	validateAdmin: () => {
		return (req, res, next) => {
			if (req.user.role !== ROLES.ADMIN) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			next();
		}
	}
};