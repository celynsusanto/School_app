'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubjectStudent = sequelize.define('SubjectStudent', {
    studentId: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
    score: DataTypes.INTEGER
  }, {});
  SubjectStudent.associate = function(models) {
    // associations can be defined here
  };
  return SubjectStudent;
};