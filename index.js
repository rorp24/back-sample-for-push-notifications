const express = require('express');
const webpush = require('web-push');
const appconf = require('./config/app.config.json');


// Replace with your email
webpush.setVapidDetails('mailto:'+appconf.mail, appconf.public_key, appconf.private_key);

const app = express();
var subscription

app.use(require('body-parser').json());

app.post('/subscribe', (req, res) => {
  subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ 
    title: 'Validate subscription',
    icon:'http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png',
    body:'You have subscribe to push notifications'
  });

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

app.post('/new-notification-to-send',(req,res)=>{
  res.status(201).json({});

  const payload = JSON.stringify({ 
    title: 'Sended data',
    icon:'http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png',
    body:req.body.content
  });
  console.log("test 1")
  setTimeout(()=>{
    console.log("test 2")
    webpush.sendNotification(subscription, payload).catch(error => {
      console.error(error.stack);
    });
  },15000)
})

app.use(require('express-static')('./'));

app.listen(3000);