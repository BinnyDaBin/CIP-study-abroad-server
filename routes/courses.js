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

    // Get each column filter and combine each to make final filtered
    const filterKeys = Object.keys(parsedFilters);
    const filtered = _.filter(MOCK_COURSES, course => {
      for (let i = 0; i < filterKeys.length; i++) {
        const filterKey = filterKeys[i];
        const filterValue = parsedFilters[filterKey];
        const courseValue = course[filterKey];

        // if column filter value is empty then treat it as select all
        if (_.isEmpty(filterValue)) continue;

        // check if filter contains course value
        if (!filterValue.includes(courseValue)) return false;
      }
      return true;
    });

    // select options for each column of filters
    const allStudyAbroadInstitutions = _.map(
      MOCK_COURSES,
      'studyAbroadInstitution'
    );
    const uniqueStudyAbroadInstitutions = _.uniq(allStudyAbroadInstitutions);

    const allProgramNames = _.map(MOCK_COURSES, 'programName');
    const uniqueProgramNames = _.uniq(allProgramNames);

    const allYears = _.map(MOCK_COURSES, 'year');
    const uniqueYears = _.uniq(allYears);

    const allKzooCourseNames = _.map(MOCK_COURSES, 'kzooCourseName');
    const uniqueKzooCourseNames = _.uniq(allKzooCourseNames);

    const allKzooDisciplines = _.map(MOCK_COURSES, 'kzooDiscipline');
    const uniqueKzooDisciplines = _.uniq(allKzooDisciplines);

    const allHostInstiCourseNumbers = _.map(
      MOCK_COURSES,
      'hostInstiCourseNumber'
    );
    const uniqueHostInstiCourseNumbers = _.uniq(allHostInstiCourseNumbers);

    const allHostInstiCourseNames = _.map(MOCK_COURSES, 'hostInstiCourseName');
    const uniqueHostInstiCourseNames = _.uniq(allHostInstiCourseNames);

    // combine all column options to send to front-end
    const allColumnOptions = {
      studyAbroadInstitutionColumnOptions: uniqueStudyAbroadInstitutions,
      programNameColumnOptions: uniqueProgramNames,
      yearColumnOptions: uniqueYears,
      kzooCourseNameColumnOptions: uniqueKzooCourseNames,
      kzooDisciplineColumnOptions: uniqueKzooDisciplines,
      hostInstiCourseNumberColumnOptions: uniqueHostInstiCourseNumbers,
      hostInstiCourseNamesColumnOptions: uniqueHostInstiCourseNames
    };

    // filtered courses per page
    const start = offset * size;
    const end = (offset + 1) * size;
    const sliced = _.slice(filtered, start, end);

    res.json({
      result: sliced,
      meta: filtered,
      columnOptions: allColumnOptions
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Bad Request');
  }
});

module.exports = router;
