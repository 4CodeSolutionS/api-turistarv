export class AccessTimeOutError extends Error{
    constructor(){
        super('O acesso expirou')
    }
}