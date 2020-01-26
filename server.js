const express = require('express');

const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000'
};

// Initialize Middleware
app.use(express.json({ extened: false }));

// Enabling Cross Origin Request for dev environment
app.use(cors(corsOptions));

app.get('/', (req, res) => res.json({ msg: 'Welcome to the CIP API' }));

// Define routes
app.use('/courses', require('./routes/courses'));
app.use('/courseColumnOptions', require('./routes/course-column-options'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
