const express = require('express');

const cors = require('cors');

const app = express();

// Enabling Cross Origin Request for dev environment
// app.use(cors());

app.get('/', (req, res) => res.json({ msg: 'Welcome to the CIP API' }));

// Define routes
app.use('/courses', require('./routes/courses'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
