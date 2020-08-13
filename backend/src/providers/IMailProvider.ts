interface IAdress {
  email: string;
  name: string;
}

export interface IMessage {
  to: IAdress;
  from: IAdress;
  subject: string;
  template: string;
  context: object;
}

export default interface IMailProvider {
  sendMail(message: IMessage, onSend: (err: any) => void): Promise<void>;
}
