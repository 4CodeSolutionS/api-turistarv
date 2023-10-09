export class InvalidPaymentError extends Error{
    constructor(){
        super('Pagamento inválido!')
    }
}