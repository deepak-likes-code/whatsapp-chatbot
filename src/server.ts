import express from 'express';
require('dotenv').config()
import bodyParser from 'body-parser';
const accountSID = process.env.TWILLIO_SID_KEY;
const authToken = process.env.TWILIO_AUTH_TOKEN_KEY;
const chatSonicToken = process.env.CHAT_API_KEY;
const MessagingResponse = require('twilio').twiml.MessagingResponse;


const sdk = require('api')('@writesonic/v2.2#4enbxztlcbti48j');
const client = require('twilio')(accountSID, authToken);

sdk.auth(chatSonicToken);

// Setup Express
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send('Hello World!') })


app.post('/incoming', async (req, res) => {
    const twiml = new MessagingResponse();
    let response;
    console.log(req.body.Body)
    await sdk.chatsonic_V2BusinessContentChatsonic_post({
        enable_google_results: true,
        enable_memory: false,
        input_text: req.body.Body
    }, { engine: 'premium' })
        .then(({ data }: { data: any }) => {
            response = data.message;
        })
        .catch((err: any) => {
            response = err;
        });
    console.log(response);
    await twiml.message(response);
    await res.writeHead(200, { 'Content-Type': 'text/xml' });
    await res.end(twiml.toString());
    console.log("Message sent! ")

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});