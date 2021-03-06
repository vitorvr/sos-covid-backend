const nodemailer = require("nodemailer");
const { resolve } = require("path");
const exphbs = require("express-handlebars");
const nodemailerhbs = require("nodemailer-express-handlebars");

const { mail } = require("../../config");

const createTransport = () => {
  let transportOptions;

  if (mail.service) {
    transportOptions = {
      service: mail.service,
      auth: mail.auth,
    };
  } else {
    transportOptions = {
      host: mail.host,
      port: mail.port,
      secure: mail.secure,
      auth: mail.auth.user ? mail.auth : null
    };
  }

  const transporter = nodemailer.createTransport(transportOptions);

  const viewPath = resolve(__dirname, "views");

  transporter.use(
    "compile",
    nodemailerhbs({
      viewEngine: exphbs.create({
        layoutsDir: resolve(viewPath, "layouts"),
        partialsDir: resolve(viewPath, "partials"),
        defaultLayout: "default",
        extname: ".hbs"
      }),
      viewPath,
      extName: ".hbs"
    })
  );

  return transporter;
};

exports.sendMail = message => {
  const transporter = createTransport();
  return transporter.sendMail({
    ...mail.default,
    ...message
  });
};
