'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Email format is incorrect'
        },
        isUnique: function (value) {
            let self = this
            return new Promise((resolve, reject) => {
              Student
                .findOne({where: {email: value}})
                .then(dataStudent => {
                  if (dataStudent && dataStudent.id != self.id) {
                    reject('Email has been used')
                  }
                  resolve()
                })
                .catch(err => {
                  reject(err)
                })
            })
        }
      }
    }
  }, {});
  Student.associate = function(models) {
    // associations can be defined here
    Student.belongsToMany(models.Subject, {through: 'SubjectStudent', foreignKey:'studentId'})
  };
  return Student;
};