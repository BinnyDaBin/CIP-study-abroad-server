module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });
};
