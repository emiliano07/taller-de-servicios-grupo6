class ModelExeption extends Error{
    constructor(name, message = null){
        super(message || name);
        this.name = name;
    }
}


class DuplicatedException extends ModelExeption{
    constructor(){
        super('DuplicatedException', 'El campo se encuentra duplicado');
    }
}

class NotFoundException extends ModelExeption{
    constructor(){
        super('NotFoundException', 'El campo no fue encontrado');
    }
}

class NotFoundRelException extends ModelExeption{
    constructor(){
        super('NotFoundRelException', 'La relacion no existe');
    }
}

module.exports = {
    DuplicatedException,
    NotFoundException,
    NotFoundRelException
}