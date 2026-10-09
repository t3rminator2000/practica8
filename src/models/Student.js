const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  fullName: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  attendancePercent: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 100,
    validate: { min: 0, max: 100 },
  },
});

module.exports = Student;