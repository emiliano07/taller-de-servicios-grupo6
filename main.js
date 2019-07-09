const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy'); // importamos el modulo unqfy

const ArtistCommands = require('./src/commands/artist');
const AlbumCommands = require('./src/commands/album');
const TrackCommands = require('./src/commands/track');
const SearchCommands = require('./src/commands/search');
const PlaylistCommands = require('./src/commands/playlist');
const ImportCommands = require('./src/commands/import');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename = 'data.json') {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename = 'data.json') {
  unqfy.save(filename);
}

/*
 En esta funcion deberán interpretar los argumentos pasado por linea de comandos
 e implementar los diferentes comandos.

  Se deberán implementar los comandos:
    - Alta y baja de Artista
    - Alta y Baja de Albums
    - Alta y Baja de tracks

    - Listar todos los Artistas
    - Listar todos los albumes de un artista
    - Listar todos los tracks de un album

    - Busqueda de canciones intepretadas por un determinado artista
    - Busqueda de canciones por genero

    - Dado un string, imprimmir todas las entidades (artistas, albums, tracks, playlists) que coincidan parcialmente
    con el string pasado.

    - Dada un nombre de playlist, una lista de generos y una duración máxima, crear una playlist que contenga
    tracks que tengan canciones con esos generos y que tenga como duración máxima la pasada por parámetro.

  La implementacion de los comandos deberá ser de la forma:
   1. Obtener argumentos de linea de comando
   2. Obtener instancia de UNQfy (getUNQFy)
   3. Ejecutar el comando correspondiente en Unqfy
   4. Guardar el estado de UNQfy (saveUNQfy)

*/

const Commands = {
  artist: (...args) => run(ArtistCommands, ...args),
  album: (...args) => run(AlbumCommands, ...args),
  track: (...args) => run(TrackCommands, ...args),
  search: (...args) => run(SearchCommands, ...args),
  playlist: (...args) => run(PlaylistCommands, ...args),
  populateAlbumsForArtist: ImportCommands.populateAlbumsForArtist,
  importLyrics: ImportCommands.importLyrics
};

function run(commands, unqfy, params) {
  const commandName = params[0];
  const commandArgs = params.slice(1);

  if (commandName === undefined) {
    //Imprime todos los comandos
    Object.keys(commands).map((c) => console.log(c));
    return;
  }

  if (!(commandName in commands)) {
    console.log(`Command ${commandName} not found.`);
    return;
  }

  return commands[commandName](unqfy, commandArgs);
}

function main() {
  console.log('--- UNQfy ---');
  const params = process.argv.slice(2);

  try {
    run(Commands, getUNQfy(), params);
  } catch (error) {
    console.log(error.message);
  }
}

main();
