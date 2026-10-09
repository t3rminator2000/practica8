const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RatingPoint = sequelize.define('RatingPoint', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
  },
});

module.exports = RatingPoint;