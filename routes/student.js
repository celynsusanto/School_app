const express = require('express')
const router = express.Router()
const Model = require('../models')
const Student = Model.Student

router.get('/', (req, res) => {
    Student
        .findAll()
        .then((allStudent) => {
            res.render('show-students', ({students: allStudent}))
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/add', (req, res) => {
    res.render('form-student')
})

router.post('/add', (req, res) => {
    Student
        .create(req.body)
        .then(() => {
            res.redirect('/students')
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/edit/:id', (req, res) => {
    Student
        .findByPk(req.params.id)
        .then((dataFound) => {
            res.render('update-student', {student: dataFound})
        })
        .catch((err) => {
            res.send(err)
        })
})

router.post('/edit/:id', (req, res) => {
    Student
        .update(req.body, {where: {id: req.params.id}})
        .then(() => {
            res.redirect('/students')
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/delete/:id', (req, res) => {
    Student
        .destroy({where: {id: req.params.id}})
        .then(() => {
            res.redirect('/students')
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/:id/add-subject', (req, res) => {
    let studentData = {}
    Student.findByPk(req.params.id)
        .then((student) => {
            studentData = student
            return Model.Subject.findAll()
        })
        .then((subjects) => {
            res.render('add-subject', {student: studentData, subjects: subjects, msg: req.query.msg || null})
        })
        .catch((err) => {
            res.send(err)
        })
})

router.post('/:id/add-subject', (req, res) => {
    let subjectId = null
    Model.Subject.findOne({where: {subject_name: req.body.subject}})
        .then((subject) => {
            subjectId = subject.id
            return Model.SubjectStudent.create({studentId: req.params.id, subjectId: subjectId})
        })
        .then(() => {
            res.redirect(`/students/${req.params.id}/add-subject?msg=Subject Added`)
        })
        .catch((err) => {
            res.send(err)
        })
})

module.exports = router