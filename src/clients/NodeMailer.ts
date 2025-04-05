import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

class NodeMailerClient {
    constructor(private readonly config: SMTPTransport.Options) {
        this.config = config;
    }
    getEmailClient() {
        return nodemailer.createTransport(this.config);
    }
}

export default NodeMailerClient;
