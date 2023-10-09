export class CPFAlreadyExistsError extends Error{
    constructor(){
        super('O CPF já existe!')
    }
}