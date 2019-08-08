const express = require('express');

const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000'
};

// Enabling Cross Origin Request for dev environment
app.use(cors(corsOptions));

app.get('/', (req, res) => res.json({ msg: 'Welcome to the CIP API' }));

// Define routes
app.use('/courses', require('./routes/courses'));
app.use('/courseColumnOptions', require('./routes/courseColumnOptions'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
