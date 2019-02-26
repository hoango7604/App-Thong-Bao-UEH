const connection = require('./connection');

module.exports = {
	query: (queryString, callback) => {
		connection.query(queryString, (error, results, fields) => {
			if (error) throw error;

			callback(results);
		});
	}
};