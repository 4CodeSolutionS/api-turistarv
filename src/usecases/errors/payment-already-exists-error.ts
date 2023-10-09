export class PaymentAlreadyExistsError extends Error{
    constructor(){
        super('Não é possível efetuar o pagamento do mesmo serviço executado!')
    }
}