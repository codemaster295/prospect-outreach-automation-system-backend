import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

class NodeMailerClient {
  private transporter;

  constructor(private readonly config: SMTPTransport.Options) {

    if (this.config.port === 465) {
      this.config.secure = true;
    } else if (this.config.port === 587) {
      this.config.secure = false; 
      this.config.requireTLS = true;
    }

    this.config.tls = {
      rejectUnauthorized: true, 
    };

    this.transporter = nodemailer.createTransport(this.config);
  }

  getEmailClient() {
    return this.transporter;
  }
}

export default NodeMailerClient;