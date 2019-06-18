const fs = require('fs');
const promisify = require('util').promisify;

const unqmod = require('./unqfy');

const express = require('express');
const bodyParser = require('body-parser');

const port = 8080;

let app = express();
let router = express.Router();

let ResourceAlreadyExistsError = require('./apiErrors.js').ResourceAlreadyExistsError;
let ResourceNotFoundError = require('./apiErrors.js').ResourceNotFoundError;
let BadRequestError = require('./apiErrors.js').BadRequestError;
let InternalServerError = require('./apiErrors.js').InternalServerError;

// Retorna una instancia de UNQfy
function loadUnqfy(){
    let unqfy = new unqmod.UNQfy();
        if (fs.existsSync('data.json')) {
            unqfy = unqmod.UNQfy.load('data.json');
        }
    return unqfy; BadRequestError
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);

//Servicios de la Api:


router.route('/artists').get(function (req, res) {
    req.body
    let unqfy = loadUnqfy();
    let artists = unqfy.getListOfArtist();
    res.status(200);
    res.json(artists);
    console.log("Se obtienen los siguentes artistas: ");
    console.log(artists);
});

router.route('/artists').post(function(req, res){
    const data = req.body;
    let unqfy = loadUnqfy();
    if(data.name === undefined || data.country === undefined) throw new BadRequestError;
    let artistData = {
        name: data.name,
        country: data.country
    }
    let artist = unqfy.addArtist(artistData);
    unqfy.save();
    res.status(201);
    res.json(artist);
    console.log("Agregado un nuevo artista con los siguientes datos");
    console.log(artist);
})

router.route('/artists/:artistId').get(function (req, res) {
    let unqfy = loadUnqfy();
    let artist = unqfy.getArtistById(parseInt(req.params.artistId));
    res.status(200);
    res.json(artist);
    console.log("Datos del artista obtenido con el id " + req.params.artistId);
    console.log(artist);
});

router.route('/artists/:artistId').delete(function(req, res){
    let unqfy = loadUnqfy();
    let id = req.params.artistId;
    if(id != "undefined"){
    unqfy.deleteArtist(parseInt(id));
    unqfy.save();
    res.status(204);
    res.json();
    console.log("Borrado artista con id " + req.params.artistId);
    } else {
        throw new ResourceNotFoundError;
    }
})

router.route('/artists/:artistId').put(function(req, res){
    const data = req.body;
    let unqfy = loadUnqfy();
    let id = req.params.artistId
    let artist = unqfy.getArtistById(parseInt(id));
    artist.name = data.name;
    artist.country = data.country;
    unqfy.save();
    res.status(200);
    res.json(artist);
    console.log("Se actualizaron los datos del artista con el id " + id);
    console.log(artist);
})

router.route('/artistByName').get(function(req, res){
    let unqfy = loadUnqfy();
    let albums;
    let name = req.query.name;
    artists = unqfy.getArtistByName(name);
    res.status(200);
    res.json(artists);
    console.log("Obtengo los artists con el siguiente nombre: " + req.query.name);
    console.log(artists);
})

router.route('/albums').get(function (req, res) {
    req.body
    let unqfy = loadUnqfy();
    let albums = unqfy.getAlbums();
    res.status(200);
    res.json(albums);
    console.log("Se obtienen los siguentes albums: ");
    console.log(albums);
});

router.route('/albums').post(function(req, res){
    const data = req.body;
    let unqfy = loadUnqfy(); 
    if(data.name === undefined || data.year === undefined || data.artistId === undefined) throw new BadRequestError;
    let albumData = {
        artistId: data.artistId,
        name: data.name,
        year: data.year
    };
    let album = unqfy.addAlbum(albumData.artistId, albumData);
    unqfy.save();
    res.status(201);
    res.json(album);
    console.log("Agregado nuevo album con los siguientes datos:");
    console.log(album);
})

router.route('/albums/:albumId').get(function(req, res){
    let unqfy = loadUnqfy();
    let id = req.params.albumId
    let album = unqfy.getAlbumById(parseInt(id));
    res.status(200);
    res.json(album);
    console.log("Datos del album obtenidos con el id " + id);
    console.log(album);
})

router.route('/albumsByName').get(function(req, res){
    let unqfy = loadUnqfy();
    let albums;
    let name = req.query.name;
    albums = unqfy.getAlbumsByName(name);
    res.status(200);
    res.json(albums);
    console.log("Obtengo los albunes con el siguiente nombre: " + req.query.name);
    console.log(albums);
})

router.route('/albums/:albumId').put(function(req, res){
    const data = req.body;
    let unqfy = loadUnqfy();
    let id = req.params.albumId
    let album = unqfy.getAlbumById(parseInt(id));
    album.year = data.year;
    unqfy.save();
    res.status(200);
    res.json(album);
    console.log("Se actualizo el año del album con id " + id);
    console.log(album);
})

router.route('/albums/:albumId').delete(function(req, res){
    let unqfy = loadUnqfy();
    let id = req.params.albumId;
    unqfy.deleteAlbum(parseInt(id));
    unqfy.save();
    res.status(204);
    res.json();
    console.log("Borrado album con id " + id);
})

router.route('/tracks/:trackId/lyrics').get(function(req, res, next){
    const unqfy = loadUnqfy();
    const id = parseInt(req.params.trackId);
    const track = unqfy.getTrackById(id);

    if (track.lyrics) {
        return res.status(200).json({name: track.name, lyrics: track.lyrics});
    }

    unqfy.getLyrics(track, (lyrics, error) => {
        if (error) {
            return next(new ResourceNotFoundError());
        }

        track.lyrics = lyrics;
        unqfy.save();
        res.status(200).json({name: track.name, lyrics: lyrics});
    });
})

function errorHandler(err, req, res, next){
    console.log(err);
    if(err.type == 'entity.parse.failed'){
        //JSON INVALIDO
        let error = new BadRequestError;
        res.status(error.statusCode);
        res.json(error);
    }
    if(err.statusCode === 409 ||
       err.statusCode === 404 ||
       err.statusCode === 400){
        res.status(err.statusCode);
        res.json(err);
    }
    else{
        //FALLO INESPERADO
        console.log(err);
        let error = new InternalServerError;
        res.status(error.statusCode);
        res.json(error);
    }
}

app.use((req, res, err) => {
    let error = new ResourceNotFoundError;
    res.status(error.statusCode);
    res.json(error);
})

//Levanta servicio en el puerto 8080
app.listen(port, () => console.log('Listening on ' + port));
