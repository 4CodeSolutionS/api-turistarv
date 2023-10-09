export class KeyAlreadyActive extends Error{
    constructor(){
        super('Chave já ativa')
    }
}