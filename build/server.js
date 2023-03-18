"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const chatSonicToken = process.env.CHAT_API_KEY;
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const sdk = require('api')('@writesonic/v2.2#4enbxztlcbti48j');
const client = require('twilio')(accountSID, authToken);
sdk.auth(chatSonicToken);
// Setup Express
const app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => { res.send('Hello World!'); });
app.post('/incoming', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const twiml = new MessagingResponse();
    let response;
    yield sdk.chatsonic_V2BusinessContentChatsonic_post({
        enable_google_results: true,
        enable_memory: false,
        input_text: req.body.Body
    }, { engine: 'premium' })
        .then(({ data }) => {
        response = data.message;
    })
        .catch((err) => {
        response = err;
    });
    console.log(response);
}));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
