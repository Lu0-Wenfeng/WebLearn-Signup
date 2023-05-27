const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.Email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/8186c7264d"

    const options = {
        method: "POST",
        auth: "polycozy:7ab8dcb7973fd404df95d728112457f8-us2"
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

app.post('/failure', (req, res) => {
    res.redirect('/');
})

// port 3000 is for local server and 
// process.env.PORT is for Heroku server
app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
});

// Mailchimp
// API Key: 7ab8dcb7973fd404df95d728112457f8-us21
// list ID: 8186c7264d