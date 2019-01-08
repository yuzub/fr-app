const clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: "413e15c29c194e00b01158d0c6ecdd7e"
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => res.json(data))
      .catch(err => res.status(400).json('unable to work with Clarifai API'));
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      // console.log(entries);
      res.json(entries[0]);
    })
    .catch(err => res.status(404).json('unable to get entries'));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
}