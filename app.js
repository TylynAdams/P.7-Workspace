
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path')
const { v4 : uuidv4 } = require('uuid');

const port = process.env.PROT || 3000;
app.use(express.urlencoded({extended: false}))

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/create', (req, res) => {
    let jsonObj = readUsers();
    let newUser = {
        userId: uuidv4(),
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age
    }
    jsonObj.users.push(newUser)
    fs.writeFileSync(path.join(__dirname, "/users.json"), JSON.stringify(jsonObj));
    res.redirect('/listing')
});

app.get('/listing', (req, res) => {
    let userObj =  readUsers()
    res.render('listing', { users: userObj.users })
})

app.post('/edit', (req, res) => {
    let userObj =  readUsers()
    let result =  getUser(req.body.edit, userObj);
    res.render('edit', { user: result })
})

app.post('/delete', (req, res) => {
    let userObj = readUsers();
    let user = getUser(req.body.delete, userObj);
    userObj.users.splice(userObj.users.indexOf(user), 1)
    fs.writeFileSync(path.join(__dirname, "/users.json"), JSON.stringify(userObj));
    res.redirect('/listing')
});

app.post('/update', (req, res) => {
    let userObj =  readUsers()
    let id = req.body.update;
    let user = getUser(id, userObj);
    console.log('req.body ', req.body)
    console.log("before spread: ", user)
    userObj.users[userObj.users.indexOf(user)] = { 
        userId: id,
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age
     }
    console.log("after spread: ", user)
    fs.writeFileSync(path.join(__dirname, "/users.json"), JSON.stringify(userObj));
    res.redirect('/listing')
})

function readUsers() {
    let data = fs.readFileSync(path.join(__dirname, "/users.json"), { encoding: "utf-8" });
        let result = JSON.parse(data);
     return result;
}

function getUser(id, obj) {
    let foundUser;
    obj.users.filter(user => {
        if(user.userId === id) {
            foundUser = user;
        }
    })
    console.log('this is from getUser: ', foundUser)
    return foundUser;
}

app.listen(3000, ()=> console.log(`Server listening on port ${port}`))