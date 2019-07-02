const express = require('express');
const router = express.Router();

// @route   GET /courses
// @desc    Get a messgae
// @access  Public
router.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = router;
