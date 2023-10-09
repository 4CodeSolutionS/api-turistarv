export class PassportAlreadyExistsError extends Error{
    constructor(){
        super('O Passport já existe!')
    }
}