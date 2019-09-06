const express = require('express');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const nodemailer = require('nodemailer');
const service_account = require('./gmail_service_creds.json');

//If the environment variables don't get loaded
if(env.error){
    throw env.error
}

// Initializes express app
const app = express();
app.use(bodyParser.urlencoded({extended: false}));

const PORT = 3000;

app.get('/sendmail', async(req, res) => {
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
            to: '',
            subject: 'Test Email',
            text: 'Hello!',
            html: '<b> Test </b>'
        };
        const info = await transporter.sendMail(message);
        res.send(info);
    } catch (err) {
        console.error(err);
        res.send(err);
    }
});

app.get('/', (req, res) => {
    res.send('Hello from the mail server :)');
});

app.listen(PORT, () => {
    console.log(`App listening on Port: ${PORT}`);
});