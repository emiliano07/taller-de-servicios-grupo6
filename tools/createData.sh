#!/bin/bash

rm 'data.json'

nodejs main.js artist add "La Renga" "Argentina"
nodejs main.js album add "Esquivando charcos" 1991 0
nodejs main.js track add 0 "Somos los mismos de siempre" 125 rock
nodejs main.js track add 0 "Voy a bailar a la nave del olvido" 180 rock blues

nodejs main.js album add "Despedazado por mil partes" 1996 0
nodejs main.js track add 1 "A la carga mi rocanrol" 200 rock
nodejs main.js track add 1 "El viento que todo empuja" 200 reggae


nodejs main.js artist add "Led Zeppelin" "Inglaterra"
nodejs main.js album add "Led Zeppelin" 1969 1
nodejs main.js track add 2 "Good Times, Bad Times" 200 rock
nodejs main.js track add 2 "Black Mountain Side" 214 rock


nodejs main.js playlist create "Playlist de rock" 700 rock
