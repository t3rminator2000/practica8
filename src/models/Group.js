const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define('Group', {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
  },
});

module.exports = Group;