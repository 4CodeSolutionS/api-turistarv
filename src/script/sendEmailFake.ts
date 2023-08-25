import { EtherealProvider } from "@/providers/MailProvider/implementations/provider-ethereal";

async function run() {
const ehtreal = new EtherealProvider();

    const pathTemplate = './src/views/emails/forgot-password.hbs'
    await ehtreal.sendEmail(
       ' findUserByEmail.email', 
        'findUserByEmail.name', 
        'Redefinição de Senha', 
        'link', 
        pathTemplate 
    );

}

run();