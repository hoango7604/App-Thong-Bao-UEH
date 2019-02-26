const express = require('express');
const app = express();

const api = require('./api');

app.all('/', (req, res) => {
	res.status(200).json({ result: 'Success' });
})

app.use('/api/v1/', api);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});