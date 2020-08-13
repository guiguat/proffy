// declaring module will allow typescript to import the module
declare module "nodemailer-express-handlebars" {
  // typing module default export as `any` will allow you to access its members without compiler warning
  var nodemailerExpressHandlebars: any;
  export default nodemailerExpressHandlebars;
}
