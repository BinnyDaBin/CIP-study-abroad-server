const express = require('express');
const router = express.Router();
const MOCK_COURSES = require('./mock-courses.json');
const _ = require('lodash');

/*
  @route  GET /courses
  @desc   Get courses with filter and paignation
  @access public
*/
router.get('/', (req, res) => {
  try {
    const filters = req.query.filters || {};
    const offset = parseInt(req.query.offset) || 0;
    const size = parseInt(req.query.size) || 10;

    const filtered = _.filter(MOCK_COURSES, JSON.parse(filters));
    const start = offset * size;
    const end = (offset + 1) * size;
    const sliced = _.slice(filtered, start, end);
    res.json(sliced);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Bad Request');
  }
});

module.exports = router;
