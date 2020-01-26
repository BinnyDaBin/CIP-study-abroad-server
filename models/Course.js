module.exports = (sequelize, DataTypes) => {
  return sequelize.define('courses', {
    study_abroad_institution: {
      type: DataTypes.TEXT,
      allowNull: false,
      trim: true
    },
    program_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      trim: true
    },
    kzoo_course_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      trim: true
    },
    kzoo_discipline: {
      type: DataTypes.TEXT,
      allowNull: false,
      trim: true
    },
    host_insti_course_number: {
      type: DataTypes.TEXT,
      allowNull: false,
      trim: true
    },
    host_insti_course_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      trim: true
    },
    start_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      trim: true
    },
    end_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      trim: true
    }
  });
};
