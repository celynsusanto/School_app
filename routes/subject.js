const express = require('express')
const router = express.Router()
const Models = require('../models')
const Subject = Models.Subject

router.get('/', (req, res) => {
    Subject
        .findAll()
        .then((allSubject) => {
            let subjects = allSubject.map(sub => {
                return new Promise((resolve, reject) => {
                    sub.getTeachers()
                        .then((teachers) => {
                            sub.dataValues['Teachers'] = teachers
                            resolve(sub)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })

            })
            return Promise.all(subjects)
        })
        .then(subjectAndTeacher => {
            // res.send(subjectAndTeacher[0].dataValues.Teachers)
            res.render('show-subjects', {subjects: subjectAndTeacher})
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/add', (req, res) => {
    res.render('form-subject')
})

router.post('/add', (req, res) => {
    Subject
        .create(req.body)
        .then(() => {
            res.redirect('/subjects')
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/edit/:id', (req, res) => {
    Subject
        .findByPk(req.params.id)
        .then((dataFound) => {
            res.render('update-subject', {subject: dataFound})
        })
        .catch((err) => {
            res.send(err)
        })
})

router.post('/edit/:id', (req, res) => {
    Subject
        .update(req.body, {where: {id: req.params.id}})
        .then(() => {
            res.redirect('/subjects')
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/delete/:id', (req, res) => {
    Subject
        .destroy({where: {id: req.params.id}})
        .then(() => {
            res.redirect('/subjects')
        })
        .catch((err) => {
            res.send(err)
        })
})

router.get('/:id/enrolled-students', (req, res) => {
    let subject = {}
    Subject.findByPk(req.params.id)
        .then(subjectFound => {
            subject = subjectFound
            // console.log(subjectFound)
            return subjectFound.getStudents()
        })
        .then(students => {
            subject.dataValues['Students'] = students
            // res.send(subject)
            // res.send(subject.dataValues.Students[0].SubjectStudent)
            res.render('subject-detail', {subject: subject, students: subject.dataValues.Students})
        })
        .catch(err => {
            res.send(err)
        })
})

router.get('/:id/give-score', (req, res) => {
    res.render('give-score', {id: req.params.id, studentId: req.query.studentId})
})

router.post('/:id/give-score', (req, res) => {
    Models.SubjectStudent
        .update({score: req.body.score}, {where: {subjectId: req.params.id, studentId:req.query.studentId}})
        .then(() => {
            res.redirect(`/subjects/${req.params.id}/enrolled-students`)
        })
        .catch((err) => {
            res.send(err)
        })
})

module.exports = router