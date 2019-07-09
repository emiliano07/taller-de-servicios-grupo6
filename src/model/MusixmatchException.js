class MusixmatchExeption extends Error{
    constructor(name, message = null){
        super(message || name);
        this.name = name;
    }
}


class NotFoundLyrics extends MusixmatchExeption{
    constructor(){
        super('NotFoundLyrics', 'Musixmatch lyrics not found');
    }
}

module.exports = {
    NotFoundLyrics,
}