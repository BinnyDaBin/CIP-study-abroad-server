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

    const parsedFilters = JSON.parse(filters);

    const filterKeys = Object.keys(parsedFilters);
    const filtered = _.filter(MOCK_COURSES, course => {
      for (let i = 0; i < filterKeys.length; i++) {
        const filterKey = filterKeys[i];
        const filterValue = parsedFilters[filterKey];
        const courseValue = course[filterKey];

        if (!filterValue.includes(courseValue)) {
          return false;
        }
      }
      return true;
    });

    const columnIds = Object.keys(MOCK_COURSES[0]);
    const columnOptions = _.transform(
      columnIds,
      (allOptions, columnId) => {
        allOptions[columnId] = _.uniq(_.map(MOCK_COURSES, columnId));
      },
      {}
    );

    const start = offset * size;
    const end = (offset + 1) * size;
    const sliced = _.slice(filtered, start, end);

    res.json({
      result: sliced,
      meta: filtered,
      columnOptions
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Bad Request');
  }
});

module.exports = router;
