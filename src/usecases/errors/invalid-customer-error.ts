export class InvalidCustomerError extends Error{
    constructor(){
        super('Cliente inválido!')
    }
}