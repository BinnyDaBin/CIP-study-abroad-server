const express = require('express');
const { Client } = require('pg');
const router = express.Router();
const MOCK_COURSES = require('./mock-courses.json');
const _ = require('lodash');
const changeCase = require('change-case');

const client = new Client({
  user: 'postgres',
  password: 'kong8190',
  host: 'localhost',
  port: 5432,
  database: 'cip'
});

client.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Postgresql connected...');
});

/*
  @route  GET /courses
  @desc   Get courses with filter and paignation
  @access public
*/
router.get('/', async (req, res) => {
  try {
    const filters = req.query.filters || {};
    const page = parseInt(req.query.offset) || 0;
    const size = parseInt(req.query.size) || 10;
    const offset = page * size;

    let parsedFilters = JSON.parse(filters);

    parsedFilters = _.each(parsedFilters, (value, key) => {
      if (key === 'year') {
        let startYears = [];
        let endYears = [];
        _.each(value, year => {
          const split = year.split('-');
          startYears.push(Number(split[0]));
          endYears.push(Number(split[1]));
        });
        parsedFilters.startYear = startYears;
        parsedFilters.endYear = endYears;
        delete parsedFilters.year;
      }
    });

    const filterKeys = Object.keys(parsedFilters);

    let query = {};

    if (filterKeys.length === 0) {
      query = 'SELECT * FROM course';
    } else {
      let filterKey = filterKeys[0];
      let filterValue = parsedFilters[filterKey];

      filterKey = changeCase.snakeCase(filterKey);
      filterValue = "'" + filterValue.join("','") + "'";

      query = `SELECT * FROM course WHERE ${filterKey} IN (${filterValue})`;

      if (filterKeys.length > 1) {
        for (let i = 1; i < filterKeys.length; i++) {
          filterKey = filterKeys[i];
          filterValue = parsedFilters[filterKey];

          filterKey = changeCase.snakeCase(filterKey);
          filterValue = "'" + filterValue.join("','") + "'";

          query = query + ` AND ${filterKey} IN (${filterValue})`;
        }
      }
    }

    let filtered = await client.query(query);
    filtered = filtered.rows;

    query = query + ` ORDER BY start_year DESC OFFSET ${offset} LIMIT ${size}`;

    let sliced = await client.query(query);
    sliced = sliced.rows;

    sliced = _.each(sliced, course => {
      const year = course.start_year + '-' + course.end_year;
      course.year = year;
      delete course.start_year;
      delete course.end_year;
    });

    for (let i = 0; i < sliced.length; i++) {
      let course = sliced[i];
      course = _.each(course, (value, key) => {
        key = changeCase.camelCase(key);
        course[key] = value;
      });
    }

    const sql = 'SELECT * FROM course ORDER BY start_year DESC';
    let courses = await client.query(sql);
    courses = courses.rows;

    courses = _.each(courses, course => {
      const year = course.start_year + '-' + course.end_year;
      course.year = year;
      delete course.start_year;
      delete course.end_year;
    });

    let columnIds = Object.keys(courses[0]);
    columnIds = columnIds.slice(1, columnIds.length);
    let columnOptions = _.transform(
      columnIds,
      (allOptions, columnId) => {
        allOptions[columnId] = _.uniq(_.map(courses, columnId));
      },
      {}
    );
    columnOptions = _.each(columnOptions, (value, key) => {
      key = changeCase.camelCase(key);
      columnOptions[key] = value;
    });

    res.json({
      result: sliced,
      totalLength: filtered.length,
      columnOptions
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Bad Request');
  }
});

module.exports = router;
