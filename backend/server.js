const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {users: [
    {
        id: '0',
        name: 'John',
        email: 'john@gmail.com',
        password: 'cookies',
        entries: 0,
        joined: new Date()
    },
    {
        id: '1',
        name: 'Sally',
        email: 'sally@gmail.com',
        password: 'bananas',
        entries: 0,
        joined: new Date()
    }
]};

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json('success');
        } else {
            res.status(400).json('error signin');
        }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: '2',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date() 
    });
    res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    for (let i = 0; i < database.users.length; i++) {
        const user = database.users[i];
        if (user.id === id) {
            return res.json(user);
        }
    }
    return res.status(404).json('not found');
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    for (let i = 0; i < database.users.length; i++) {
        const user = database.users[i];
        if (user.id === id) {
            user.entries++;
            return res.json(user.entries);
        }
    }
    return res.status(404).json('not found');
});

/*
/ --> GET res = Server is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
*/

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
