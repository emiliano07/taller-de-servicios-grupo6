const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const port = 5001;
const app = express();
const router = express.Router();

const unqmod = require('./unqfy');

function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.unqfy = getUNQfy();
  next();
});
app.use('/api', router);

router.route('/subscribe').post((req, res) => {
  const artistId = req.body.artistId;
  const email = req.body.email;

  req.unqfy.notifyService.subscribe(artistId, email);
  req.unqfy.save();

  res.status(200).json();
});

router.route('/subscriptions').get((req, res) => {
  const artistId = req.query.artistId;

  const subscriptions = req.unqfy.notifyService.subscriptions;

  res.status(200).json(subscriptions);
});

const errorHandler = (err, req, res, next) => {
  console.log(err);
};
app.use(errorHandler);

app.listen(port, () => console.log('Listening on ' + port));
