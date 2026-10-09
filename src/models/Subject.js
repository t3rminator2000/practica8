const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subject = sequelize.define('Subject', {
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: true },
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Subject;