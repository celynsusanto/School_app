const express = require('express')
const app = express()
const port = 3000
const Student = require('./routes/student')
const Teacher = require('./routes/teacher')
const Subject = require('./routes/subject')

app.set('view engine', 'ejs')
app.set('views', 'views/pages')

app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('home')
})
app.use('/students', Student)
app.use('/teachers', Teacher)
app.use('/subjects', Subject)


app.listen(port, () => {
    console.log(`You're now listening to port ${port}`)
})