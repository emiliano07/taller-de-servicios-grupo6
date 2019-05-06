#!/bin/bash

rm 'data.json'

node main.js artist add "La Renga" "Argentina"
node main.js album add "Esquivando charcos" 1991 0
node main.js track add 0 "Somos los mismos de siempre" 125 rock
node main.js track add 0 "Voy a bailar a la nave del olvido" 180 rock blues

node main.js album add "Despedazado por mil partes" 1996 0
node main.js track add 1 "A la carga mi rocanrol" 200 rock
node main.js track add 1 "El viento que todo empuja" 200 reggae


node main.js artist add "Led Zeppelin" "Inglaterra"
node main.js album add "Led Zeppelin" 1969 1
node main.js track add 2 "Good Times, Bad Times" 200 rock
node main.js track add 2 "Black Mountain Side" 214 rock


node main.js playlist create "Playlist de rock" 700 rock
