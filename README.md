# Taller de Servicios - Grupo 6

***
## Integrantes
+ Francioni Lucio
+ Mancuso Emiliano
+ Slavich Hernán

***
## Información
+ [UML](https://github.com/emiliano07/taller-de-servicios-grupo6/wiki)

## Docker
Crear red
`
docker network create --subnet=172.20.0.0/16 unqfynet
`

Buildear imagenes
`
docker build -t unqfy/api -f docker/Dockerfile-apiunqfy .
`

`
docker build -t unqfy/notificaciones -f docker/Dockerfile-notificaciones .
`

`
docker build -t unqfy/logging -f docker/Dockerfile-logging .
`

Correr instancias
`
docker run --rm --net unqfynet --ip 172.20.0.21 -p 5000:5000 --name unqfy_api unqfy/api
`

`
docker run --rm --net unqfynet --ip 172.20.0.22 -p 5001:5001 --name unqfy_notificaciones unqfy/notificaciones
`

`
docker run --rm --net unqfynet --ip 172.20.0.23 -p 5002:5002 --name unqfy_logging unqfy/logging
`

## Comandos

### artist add
`
nodejs main.js artist add "Artista" "Pais"
`

### artist delete
`
nodejs main.js artist delete 1
`

### artist list
`
nodejs main.js artist list
`

### artist print
`
nodejs main.js artist print 1
`

### album add
`
nodejs main.js album add "AlbumNombre" 2015 artistId
`

### album delete
`
nodejs main.js album delete 1
`

### album list
`
nodejs main.js album list
`

### album print
`
nodejs main.js album print 1
`

### track add
`
nodejs main.js track add albumId "Nombre de la cancion" 120 rock pop
`

### track delete
`
nodejs main.js track delete 1
`

### track list
`
nodejs main.js track list
`

### track print
`
nodejs main.js track print 1
`

### playlist create
`
nodejs main.js playlist create "Nombre de playlist" 500 rock pop
`

### playlist delete
`
nodejs main.js playlist delete 1
`

### playlist list
`
nodejs main.js playlist list
`

### playlist print
`
nodejs main.js playlist print 1
`

### search allByName
Busca e imprimir en pantalla tracks, álbumes o artistas por matching parcial contra el nombre de los objetos.

`
nodejs main.js search allByName "nombre"
`

### search tracksByArtist
Busca e imprime todos los tracks de un determinado artista.

`
nodejs main.js search tracksByArtist artistId
`

### search tracksByGenres
Buscar e imprime todos los tracks que poseen un género particular.

`
nodejs main.js search tracksByGenres rock pop
`
