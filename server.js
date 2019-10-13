const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');
const service_account = require('./keys/gmail_service_creds.json');

const PORT = process.env.PORT || 3000;
const WEBSITE_VERIFICATION_TOKEN = process.env.WEBSITE_VERIFICATION_TOKEN;
const FROM_EMAIL = process.env.FROM_EMAIL;
const FROM_NAME = process.env.FROM_NAME;
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL;
const HOMEPAGE = process.env.HOMEPAGE;

// Initializes express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/sendmail', async(req, res) => {
    if (req.body.token !== WEBSITE_VERIFICATION_TOKEN) {
        return res.redirect(HOMEPAGE);
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: FROM_EMAIL,
            serviceClient: service_account.client_id,
            privateKey: service_account.private_key
        }
    });

    let success = true;

    try {
        await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
            replyTo: REPLY_TO_EMAIL,
            to: req.body.to,
            subject: req.body.subject,
            text: req.body.body,
            // html: '<b> Test </b>'
        });
        res.status(200).send('Email successfully sent!');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/', (req, res) => res.redirect(HOMEPAGE));
app.listen(PORT, () => console.log(`App listening on Port: ${PORT}`));
