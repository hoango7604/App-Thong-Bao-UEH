const bcrypt = require('bcryptjs');

module.exports = {
	hashPassword: async (password) => {
		try {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			return hashedPassword;
		}
		catch(error) {
			throw new Error(error);
		}
	},

	isValidPassword: async (password, user) => {
		try {
			return await bcrypt.compare(password, user.password);
		}
		catch(error) {
			throw new Error(error);
		}
	}
};