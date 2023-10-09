export class LeadAlreadyExistsError extends Error{
    constructor(){
        super('O Lead já existe!')
    }
}