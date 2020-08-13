import { IMessage } from "./IMailProvider";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import Mail from "nodemailer/lib/mailer";
import config from "./nodemailer.config";

class MailtrapMailProvider {
  private transporter: Mail;
  constructor() {
    this.transporter = nodemailer.createTransport(config);

    this.transporter.use(
      "compile",
      hbs({
        viewEngine: {
          defaultLayout: undefined,
          partialsDir: path.resolve("./src/resources/mail/"),
        },
        viewPath: path.resolve("./src/resources/mail"),
        extName: ".html",
      })
    );
  }

  async sendMail(message: IMessage, onSend: (err: any) => void) {
    this.transporter.sendMail(
      {
        to: {
          name: message.to.name,
          address: String(message.to.email),
        },
        from: {
          name: message.from.name,
          address: message.from.email,
        },
        subject: message.subject,
        template: message.template,
        context: message.context,
      } as any,
      onSend
    );
  }
}

export default MailtrapMailProvider;
