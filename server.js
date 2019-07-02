const express = require('express');

const app = express();

app.get('/', (req, res) => res.json({ msg: 'Welcome to theCIP API' }));

// Define routes
app.use('/courses', require('./routes/courses'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
