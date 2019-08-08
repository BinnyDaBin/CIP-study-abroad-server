const express = require('express');
const { Client } = require('pg');
const router = express.Router();
const _ = require('lodash');

const client = new Client({
  user: 'cipuser',
  password: 'cippassword',
  host: 'localhost',
  port: 5432,
  database: 'cip'
});

client.connect(err => {
  if (err) {
    throw err;
  }
  console.info('Postgresql connected...');
});

/*
  @route  GET /courseColumnOptions
  @desc   Get column options for course search
  @access public
*/
router.get('/', async (req, res) => {
  try {
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
      key = _.camelCase(key);
      columnOptions[key] = value;
    });

    res.send(columnOptions);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Bad Request');
  }
});

module.exports = router;
