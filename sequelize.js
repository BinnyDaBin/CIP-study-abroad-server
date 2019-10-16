const Sequelize = require('sequelize');
const UserModel = require('./models/User');
const CourseModel = require('./models/Course');

const sequelize = new Sequelize('cip', 'cipuser', 'cippassword', {
  host: 'localhost',
  dialect: 'postgres'
});

// another option: authenticate()/sync({ force: true })
sequelize.authenticate().then(() => {
  console.log('PostgreSQL connected...');
});

const User = UserModel(sequelize, Sequelize);
const Course = CourseModel(sequelize, Sequelize);

module.exports = { User, Course, sequelize };
