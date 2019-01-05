const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');

const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'fullstackapp',
    database: 'smartbrain'
  }
});

// console.log(db.select().from('users'));
// db.select().from('users').then(data => console.log(data));

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
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
  ]
};

app.get('/', (req, res) => {
  db.select().from('users')
    .then(data => {
      console.log(data);
      res.send(data);
    });
});

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      console.log(data[0]);
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        db.select().from('users')
          .where('email', '=', req.body.email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json('unable to get user from users'));
      } else {
        res.status(400).json('wrong credentials - wrong password');
      }
    })
    .catch(err => res.status(400).json('wrong credentials - wrong email'));

  /*   if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
      // res.json('success');
      res.json(database.users[0]);
    } else {
      res.status(400).json('error signin');
    } */
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
    .catch(err => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select().from('users').where({ id: id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json('not found');
      }
    })
    .catch(err => res.status(404).json('error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      // console.log(entries);
      res.json(entries[0]);
    })
    .catch(err => res.status(404).json('unable to get entries'));
});

/*
/ --> GET res = Server is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
*/

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
