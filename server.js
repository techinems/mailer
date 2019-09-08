const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');
const service_account = require('./keys/gmail_service_creds.json');


// Initializes express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const PORT = 3000;
const WEBSITE_TOKEN = process.env.WEBSITE_VERIFICATION_TOKEN;

app.post('/sendmail', async(req, res) => {
    if (req.body.token !== WEBSITE_TOKEN) {
        res.send({success: false, msg: 'Nope'});
    }
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'events@rpiambulance.com',
            serviceClient: service_account.client_id,
            privateKey: service_account.private_key
        }
    });
    try {
        const message = {
            from: '"RPIA Events" <events@rpiambulance.com>',
            replyTo: 'officers@rpiambulance.com',
            to: req.body.to,
            subject: req.body.subject,
            text: req.body.body,
            // html: '<b> Test </b>'
        };
        await transporter.sendMail(message);
        res.send({success: true, msg: 'Email successfully sent!'});
    } catch (err) {
        console.error(err);
        res.send({success: false, msg: err});
    }
});

app.get('/', (req, res) => {
    res.send('Hello from the mail server :)');
});

app.listen(PORT, () => {
    console.log(`App listening on Port: ${PORT}`);
});