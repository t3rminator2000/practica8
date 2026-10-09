const sequelize = require('../config/database');
const Group = require('./Group');
const Teacher = require('./Teacher');
const Subject = require('./Subject');
const Student = require('./Student');
const RatingPoint = require('./RatingPoint');

Group.hasMany(Student, { foreignKey: 'groupId', onDelete: 'RESTRICT' });
Student.belongsTo(Group, { foreignKey: 'groupId' });

Teacher.hasMany(Subject, { foreignKey: 'teacherId', onDelete: 'RESTRICT' });
Subject.belongsTo(Teacher, { foreignKey: 'teacherId' });

Student.hasMany(RatingPoint, { foreignKey: 'studentId', onDelete: 'CASCADE' });
RatingPoint.belongsTo(Student, { foreignKey: 'studentId' });

Subject.hasMany(RatingPoint, { foreignKey: 'subjectId', onDelete: 'CASCADE' });
RatingPoint.belongsTo(Subject, { foreignKey: 'subjectId' });

module.exports = { sequelize, Group, Teacher, Subject, Student, RatingPoint };