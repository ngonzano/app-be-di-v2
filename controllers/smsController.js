var https = require('follow-redirects').https;
var fs = require('fs');
const dotenv = require("dotenv");
const http = require('http');
const path = require('path');

const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();

// Variable de entorno
dotenv.config({ path: "./.env" });

module.exports = {

    async sms(req, res, next) {

        try{
            const codigo = req.body.codigo
            const phone = req.body.phone

        var options = {
            'method': 'POST',
            'hostname': 'nzj2e2.api.infobip.com',
            'path': '/sms/2/text/advanced',
            'headers': {
                'Authorization': `App ${process.env.Authorization}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            'maxRedirects': 20
        };
        
        var req = https.request(options, function (res) {
            var chunks = [];
        
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
        
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                // console.log(body.toString());
            });
        
            res.on("error", function (error) {
                console.error(error);
            });
        });
        
        var postData = JSON.stringify({
            "messages": [
                {
                    "destinations": [{"to":phone}],
                    "from": "ServiceSMS",
                    "text": `Desde la App PIDEPE, su código de verificación es: ${codigo}`
                }
            ]
        });
        
        req.write(postData);
        
        req.end();

        return res.status(200).json({
            success: true,
            message: codigo
        })
        }
        catch(error){
            return res.status(501).json({
                success: false,
                message: `${error}`
            })
        }

    },
    async whatsapp(req, res, next){
       try {
        const codigo = req.body.codigo
        const phone = req.body.phone

        var options = {
            'method': 'POST',
            'hostname': 'nzj2e2.api.infobip.com',
            'path': '/whatsapp/1/message/template',
            'headers': {
                'Authorization': `App ${process.env.Authorization}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            'maxRedirects': 20
        };
        
        var req = https.request(options, function (res) {
            var chunks = [];
        
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
        
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        
            res.on("error", function (error) {
                console.error(error);
            });
        });
        
        var postData = JSON.stringify({
            "messages": [
                {
                    "from": "447860099299",
                    "to": phone,
                    "messageId": uuid,
                    "content": {
                        "templateName": "wp",
                        "templateData": {
                            "body": {
                                "placeholders": [codigo]
                            },
                        },
                        "language": "en"
                    }
                }
            ]
        });
        
        req.write(postData);
        
        req.end();

        return res.status(200).json({
            success: true,
            message: `${process.env.PHONE}`
        })

       } catch (error) {
        return res.status(501).json({
            success: false,
            message: `${error}`
        })
       }
    }
}