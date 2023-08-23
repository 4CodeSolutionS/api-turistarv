import sgMail from '@sendgrid/mail';
import { env } from "@/.env";
import 'dotenv/config'
import fs from 'node:fs'
import handlebars from "handlebars";

// implements IMailProvider
export class SendGridProvider{
    constructor(){
        sgMail.setApiKey(env.SENDGRID_API_KEY)
    }

    async sendEmail(
        email: string, 
        name:string, 
        subject:string, 
        link:string, 
        pathTemplate:string) {
        try {
            // ler arquivo handlebars
            const readTemplate = fs.readFileSync(pathTemplate).toString("utf-8");
            // compilar o arquivo handlebars
            const compileTemplate = handlebars.compile(readTemplate);
            // passar variables for template
            const htmlTemplate = compileTemplate({name, link});

            const msg = {
                to: `kaio-dev@outlook.com`, // Para 
                from: '4codesolutionss@gmail.com', // De
                subject: subject, // Assunto
                html: htmlTemplate,
              };
            
           await sgMail.send(msg);
           console.log('Email enviado com sucesso')
        } catch (error) {
            console.log(error);
        }
    }
}