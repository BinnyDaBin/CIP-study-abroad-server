const express = require('express');
const router = express.Router();
const _ = require('lodash');

const { sequelize } = require('../sequelize');

/*
  @route  GET /courses
  @desc   Get courses with filter and paignation
  @access public
*/
router.get('/', async (req, res) => {
  try {
    const filters = req.query.filters || {};
    const offset = parseInt(req.query.offset) || 0;
    const size = parseInt(req.query.size) || 10;

    const parsedFilters = JSON.parse(filters);

    if (parsedFilters.year) {
      const startYears = [];
      const endYears = [];
      _.each(parsedFilters.year, year => {
        const split = year.split('-');
        startYears.push(Number(split[0]));
        endYears.push(Number(split[1]));
      });
      parsedFilters.startYear = startYears;
      parsedFilters.endYear = endYears;
      delete parsedFilters.year;
    }

    const filterKeys = Object.keys(parsedFilters);

    let query = 'SELECT * FROM courses';
    if (filterKeys.length > 0) {
      for (let i = 0; i < filterKeys.length; i++) {
        filterKey = filterKeys[i];
        filterValue = `'${parsedFilters[filterKey].join("','")}'`;
        filterKey = _.snakeCase(filterKey);

        query += `${
          i === 0 ? ' WHERE' : ' AND'
        } ${filterKey} IN (${filterValue})`;
      }
    }

    query += ' ORDER BY start_year DESC';

    let filtered = await sequelize
      .query(query, {
        type: sequelize.QueryTypes.SELECT
      });

    const sliced = filtered.slice(offset * size, (offset + 1) * size);

    const normalized = _.chain(sliced)
      .map(course => {
        const year = `${course.start_year}-${course.end_year}`;
        const { start_year, end_year, id, ...rest } = course;
        return {
          year,
          ...rest
        };
      })
      .map(course => {
        return _.transform(
          course,
          (normalizedCourses, value, key) => {
            normalizedCourses[_.camelCase(key)] = value;
          },
          {}
        );
      })
      .value();

    res.json({
      result: normalized,
      totalLength: filtered.length
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Bad Request');
  }
});

module.exports = router;
