const express = require('express');

const cors = require('cors');

const app = express();

// Then use it before your routes are set up:
app.use(cors());

app.get('/', (req, res) => res.json({ msg: 'Welcome to theCIP API' }));

// Define routes
app.use('/courses', require('./routes/courses'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
