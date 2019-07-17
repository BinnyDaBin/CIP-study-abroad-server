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
  const filters = req.query.filters;
  const offset = parseInt(req.query.offset);
  const size = parseInt(req.query.size);

  const filtered = _.filter(MOCK_COURSES, JSON.parse(filters));
  const start = offset * size;
  const end = (offset + 1) * size;
  const sliced = _.slice(filtered, start, end);
  res.json(sliced);
});

module.exports = router;
