#!/bin/bash

docker run --rm -d --net unqfynet --ip 172.20.0.21 -p 5000:5000 -v $(pwd)/data.json:/usr/src/app/data.json --name unqfy_api unqfy/api
docker run --rm -d --net unqfynet --ip 172.20.0.22 -p 5001:5001 -v $(pwd)/data.json:/usr/src/app/data.json --name unqfy_notificaciones unqfy/notificaciones
docker run --rm -d --net unqfynet --ip 172.20.0.23 -p 5002:5002 --name unqfy_logging unqfy/logging
