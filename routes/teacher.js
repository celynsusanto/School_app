const express = require('express')
const router = express.Router()
const Models = require('../models')
const Teacher = Models.Teacher

router.get('/', (req, res) => {
    let teachers = null
    Teacher
        .findAll({include: Models.Subject})
        .then((allTeachers) => {
            teachers = allTeachers
            // res.send(allTeachers)
            res.render('show-teachers', {teachers: allTeachers})
        })
        .catch((err) => {
            res.send(err);
        })
})

router.get('/add', (req, res) => {
    Models.Subject
        .findAll()
        .then((subjects) => {
            res.render('form-teacher', {subjects: subjects, msg: req.query.msg || null})
        })
        .catch((err) => {
            // console.log('===')
            res.send(err)
        })
})

router.post('/add', (req, res) => {
    // res.send(req.body)
    let dataReceived = req.body
    let newDataTeacher = {}
    Models.Subject
        .findOne({where: {subject_name: dataReceived.subject}})
        .then((subject) => {
            newDataTeacher = {
                first_name: dataReceived.first_name,
                last_name: dataReceived.last_name,
                email: dataReceived.email,
                SubjectId: subject.id
            }
            return Teacher.create(newDataTeacher)
        })
        .then((dataAdded) => {
            // res.send(dataAdded)
            res.redirect('/teachers')
        })
        .catch((err) => {
            res.redirect(`/teachers/add?msg=${err.errors[0].message}`)
        })
})

router.get('/edit/:id', (req, res) => {
    let teacherEdit = null
    Teacher
        .findByPk(req.params.id, {include: Models.Subject})
        .then((dataFound) => {
            teacherEdit = dataFound
            return Models.Subject.findAll()
        })
        .then((subjects) => {
            res.render('update-teacher', {teacher: teacherEdit, subjects: subjects})
        })
        .catch((err) => {
            res.send(err)
        })
})

router.post('/edit/:id', (req, res) => {
    let updatedData = req.body
    Models.Subject
        .findOne({where: {subject_name: updatedData.subject}})
        .then((subjectFound) => {
            let updatedTeacher = {
                first_name: updatedData.first_name,
                last_name: updatedData.last_name,
                email: updatedData.email,
                SubjectId: subjectFound.id
            }
            updatedTeacher['id'] = req.params.id
            return Teacher.update(updatedTeacher, {where: {id: req.params.id}})
        })
        .then(() => {
            res.redirect('/teachers')
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/delete/:id', (req, res) => {
    Teacher
        .destroy({where: {id: req.params.id}})
        .then(() => {
            res.redirect('/teachers')
        })
        .catch((err) => {
            res.send(err)
        })
})

module.exports = router