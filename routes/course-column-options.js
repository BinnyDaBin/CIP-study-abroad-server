const express = require('express');
const router = express.Router();
const _ = require('lodash');

const { sequelize } = require('../sequelize');

/*
  @route  GET /courseColumnOptions
  @desc   Get column options for course search
  @access public
*/
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM courses ORDER BY start_year DESC';
    let courses = await sequelize
      .query(sql, {
        type: sequelize.QueryTypes.SELECT
      })
      .then(courses => {
        return courses;
      });

    courses = _.each(courses, course => {
      const year = `${course.start_year}-${course.end_year}`;
      course.year = year;
      delete course.start_year;
      delete course.end_year;
    });

    const [id, ...columnIds] = Object.keys(courses[0]);
    const columnOptions = _.transform(
      columnIds,
      (allOptions, columnId) => {
        allOptions[_.camelCase(columnId)] = _.uniq(_.map(courses, columnId));
      },
      {}
    );

    res.send(columnOptions);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Bad Request');
  }
});

module.exports = router;
