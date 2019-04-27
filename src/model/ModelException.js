function DuplicatedException( message ){
    this.message = message
    this.name = 'DuplicatedException'
}

function NotFoundException( message ){
    this.message = message
    this.name = 'NotFoundException'
}

function NotFoundRelException( message ){
    this.message = message
    this.name = 'NotFoundRelException'
}

module.exports = {
    DuplicatedException,
    NotFoundException,
    NotFoundRelException
}