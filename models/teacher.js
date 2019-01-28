'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
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
              Teacher
                .findOne({where: {email: value}})
                .then(dataTeacher => {
                  if (dataTeacher && dataTeacher.id != self.id) {
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
    },
    SubjectId: DataTypes.INTEGER
  }, {});
  Teacher.associate = function(models) {
    // associations can be defined here
    Teacher.belongsTo(models.Subject)
  };
  return Teacher;
};