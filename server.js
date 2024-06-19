const express = require('express');
var bodyParser = require('body-parser')
const textflow = require("textflow.js")

textflow.useKey("7Bg2OB3M16qfYHzqhYW2IdKv162onxKwMa2bZGEYRpphzxsd7XY9JhbcobIUkjHN")

const app = express();

class User {
    static list = {}
    constructor(phoneNumber) {
        this.phoneNumber = phoneNumber;
        
    }
    static add( phoneNumber) {
        
        this.list[phoneNumber] = new User( phoneNumber);
        return true;
    }
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
    const { phoneNumber, code } = req.body

    var result = await textflow.verifyCode(phoneNumber, code);

    if(!result.valid){
        return res.status(400).json({ success: false });
    }

    if (User.add( phoneNumber))
        return res.status(200).json({ success: true });

    return res.status(400).json({ success: false });
})

app.post("/verify", async (req, res) => {
    const { phoneNumber } = req.body

    var result = await textflow.sendVerificationSMS(phoneNumber);

    if (result.ok) //send sms here
        return res.status(200).json({ success: true });

    return res.status(400).json({ success: false });
})

app.listen(2000);