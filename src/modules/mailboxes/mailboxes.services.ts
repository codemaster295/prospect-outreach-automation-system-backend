import NodeMailerClient from '@/clients/NodeMailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Imap from 'node-imap';
export const testSMTPConnection = async (config: SMTPTransport.Options) => {
    const transporter = new NodeMailerClient(config);
    const emailClient = transporter.getEmailClient();
    if (!emailClient) {
        throw new Error('Failed to create emailClient');
    }
    await new Promise((resolve, reject) => {
        emailClient.verify((error, success) => {
            if (success) {
                resolve(success);
            } else {
                // console.log(error);
                reject(error);
            }
        });
    });
};

export const testImapConnection = async (config: any) => {
    let configCopy = JSON.parse(JSON.stringify(config));
    if (configCopy.port === 993) {
        configCopy.tls = true;
        configCopy.tlsOptions = {
            rejectUnauthorized: false,
        };
    } else {
        configCopy.autotls = 'always';
    }
    delete configCopy.auth;
    configCopy = {
        ...configCopy,
        user: config.auth.user,
        password: config.auth.pass,
    };

    const imap = new Imap(configCopy);

    return new Promise((resolve, reject) => {
        imap.once('ready', function () {
            imap.end();
            resolve({ authState: imap.state });
        });

        imap.once('end', function () {
            // console.log('Connection ended');
        });

        // let errCount = 0;
        imap.once('error', function (err) {
            reject(err);
        });

        imap.connect();
    });
};
