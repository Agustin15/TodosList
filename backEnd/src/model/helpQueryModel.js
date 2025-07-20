import nodemailer from "nodemailer";

export class HelpQuery {
  #name;
  #description;
  #emailClient;
  #files;

  constructor(name, description, emailClient, files) {
    this.propName = name;
    this.propDescription = description;
    this.propEmailClient = emailClient;
    this.propFile = files;
  }
  set propName(value) {
    if (!value || value.length == 0 || !this.verifyValidString(value))
      throw new Error("Enter a valid name");

    this.#name = this.toUpperCase(value);
  }
  get propName() {
    return this.#name;
  }

  set propDescription(value) {
    if (!value || value.length == 0) throw new Error("Enter a description");

    this.#description = value;
  }
  get propDescription() {
    return this.#description;
  }

  set propEmailClient(value) {
    let regexMail = /\S+@\S+\.\S+/;
    if (!value || value.length == 0 || !regexMail.test(value))
      throw new Error("Enter a valid email");

    this.#emailClient = value;
  }
  get propEmailClient() {
    return this.#emailClient;
  }

  set propFile(value) {
    if (value && value.length > 3)
      throw new Error("Limit quantity of files exceeded");

    if (value && value.length > 0) {
      if (this.fileSizeExceededOfLimit(value)) {
        throw new Error("Limit size file exceeded (only allow 10MB)");
      } else if (!this.verifyAllowTypeFile(value))
        throw new Error(
          "Type file not allow, (only allow images png,jpeg,jpg)"
        );
    }

    this.#files = value;
  }
  get propFile() {
    return this.#files;
  }

  verifyValidString(value) {
    let valid = true;
    for (let f = 0; f < value.length; f++) {
      if (!value[f].match(/[a-z]/i) || [f] == "") {
        return false;
      }
    }
    return valid;
  }
  toUpperCase(value) {
    let newValue = [...value].map((letter, index) => {
      if (index == 0) {
        return letter.toUpperCase();
      }
      return letter;
    });
    return newValue.join("");
  }
  fileSizeExceededOfLimit = (files) => {
    let exceeded = false;
    for (const file of files) {
      if (file.size > 1000 * 10000) {
        return true;
      }
    }
    return exceeded;
  };

  verifyAllowTypeFile = (files) => {
    const mimeAccept = ["image/png", "image/jpeg", "image/jpg", "image/jfif"];

    let allow = true;
    for (const file of files) {
      if (mimeAccept.indexOf(file.mimetype.toLowerCase()) == -1) {
        return false;
      }
    }
    return allow;
  };

  sendQuery = async () => {
    if (!process.env.APP_MAIL) throw new Error("APP MAIL not declared");
    if (!process.env.PASSWORD_APP_MAIL)
      throw new Error("PASSWORD APP MAIL not declared");

    const appEmail = process.env.APP_MAIL;
    const passwordEmailApp = process.env.PASSWORD_APP_MAIL;

    const attachments =
      this.propFile.length > 0
        ? this.propFile.map((file) => {
            return {
              filename: file.originalname,
              content: file.buffer,
              contentType: file.mimetype
            };
          })
        : "";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: appEmail,
        pass: passwordEmailApp
      }
    });

    const emailSent = await transporter.sendMail({
      from: appEmail,
      to: appEmail,
      subject: `Query client:${this.propName}`,
      html: `<span>Email client:</span> <a>${this.propEmailClient}</a> <br>
       <p>Description:${this.propDescription}<p>`,
      attachments: attachments
    });

    return emailSent;
  };
}
