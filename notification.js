const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const port = process.argv[2] || 5001;
const app = express();
const router = express.Router();

const ApiError = require('./src/error/apiErrors.js');
const unqmod = require('./unqfy');

function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

app.use(morgan('dev'));
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

  if ([artistId, email].includes(undefined)) {
    throw new ApiError.BadRequestError();
  }

  try {
    req.unqfy.getArtistById(Number(artistId));
  } catch (error) {
    throw new ApiError.ResourceNotFoundError();
  }

  req.unqfy.notifyService.subscribe(artistId, email);
  req.unqfy.save();

  res.status(200).json();
});

router.route('/unsubscribe').post((req, res) => {
  const artistId = req.body.artistId;
  const email = req.body.email;

  if ([artistId, email].includes(undefined)) {
    throw new ApiError.BadRequestError();
  }

  try {
    req.unqfy.getArtistById(Number(artistId));
  } catch (error) {
    throw new ApiError.ResourceNotFoundError();
  }

  req.unqfy.notifyService.unsubscribe(artistId, email);
  req.unqfy.save();

  res.status(200).json();
});

router.route('/notify').post((req, res) => {
  const artistId = req.body.artistId;
  const subject = req.body.subject;
  const message = req.body.message;
  const from = req.body.from;

  if ([artistId, subject, message, from].includes(undefined)) {
    throw new ApiError.BadRequestError();
  }

  try {
    req.unqfy.getArtistById(Number(artistId));
  } catch (error) {
    throw new ApiError.ResourceNotFoundError();
  }

  req.unqfy.notifyService.notify(artistId, subject, message, from);

  res.status(200).json();
});

router.route('/subscriptions').get((req, res) => {
  const artistId = req.query.artistId;

  if (artistId === undefined) {
    throw new ApiError.BadRequestError();
  }

  try {
    req.unqfy.getArtistById(Number(artistId));
  } catch (error) {
    throw new ApiError.ResourceNotFoundError();
  }

  const subscriptions = req.unqfy.notifyService.subscriptions;

  res.status(200).json(subscriptions);
});

router.route('/subscriptions').delete((req, res) => {
  const artistId = req.body.artistId;

  if (artistId === undefined) {
    throw new ApiError.BadRequestError();
  }

  try {
    req.unqfy.getArtistById(Number(artistId));
  } catch (error) {
    throw new ApiError.ResourceNotFoundError();
  }

  const subscriptions = req.unqfy.notifyService.deleteArtist(artistId);
  req.unqfy.save();

  res.status(200).json(subscriptions);
});

const errorHandler = (err, req, res, next) => {
  let error = err;
  if(error.type === 'entity.parse.failed'){
    error = new ApiError.BadRequestError();
  } else if (!err.statusCode) {
    error = new ApiError.InternalServerError();
  }

  res.status(error.statusCode).json(error);
};
app.use(errorHandler);

app.use((req, res) => {
  const error = new ApiError.ResourceNotFoundError();
  res.status(error.statusCode).json(error);
});

app.listen(port, () => console.log('Listening on ' + port));
