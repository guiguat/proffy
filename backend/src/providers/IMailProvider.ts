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
