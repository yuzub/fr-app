const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect field in form');
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      // console.log(data[0]);
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        db.select().from('users')
          .where('email', '=', email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json('unable to get user from users'));
      } else {
        res.status(400).json('wrong credentials - wrong password');
      }
    })
    .catch(err => res.status(400).json('wrong credentials - wrong email'));
}

module.exports = {
  handleSignin: handleSignin
}