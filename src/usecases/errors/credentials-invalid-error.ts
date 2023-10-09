export class CredentialsInvalidError extends Error{
    constructor(){
        super('Credenciais inválidas para login!')
    }
}