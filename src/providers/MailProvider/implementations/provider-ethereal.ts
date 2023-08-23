import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { IMailProvider } from "../interface-mail-provider";

export class EtherealProvider implements IMailProvider {
  private client!: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });
        this.client = transporter;
      })
      .catch((error) => console.error(error));
  }

  async sendEmail(
        email: string, 
        name:string, 
        subject:string, 
        link:string, 
        pathTemplate:string
  ): Promise<void> {
    // ler arquivo handlebars
    const readTemplate = fs.readFileSync(pathTemplate).toString("utf-8");
    // compilar o arquivo handlebars
    const compileTemplate = handlebars.compile(readTemplate);
    // passar variables for template
    const htmlTemplate = compileTemplate({name, link});

    const message = await this.client.sendMail({
      to: email,
      from: "<noreply@rentx.com>",
      subject,
      html: htmlTemplate,
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}
