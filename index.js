const express = require('express');
const webpush = require('web-push');
var cors = require('cors')
const appconf = require('./config/app.config.json');


// Replace with your email
webpush.setVapidDetails('mailto:'+appconf.mail, appconf.public_key, appconf.private_key);

const app = express();
var subscription
app.use(require('body-parser').json());
app.use(cors({
  origin:"'*'",
}))
app.use(function (err, req, res, next) {
  console.log(err)
  res.send(500, 'Something broke!');
  next()
});

//Note for future self: as their is an issue with chrome and localhosted servers, if you want to use something else than the localhost:3000 port
//eather find a way to solve the issue, or just host that small test server on something (with the front part secured, of course.)
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
  setTimeout(()=>{
    webpush.sendNotification(subscription, payload).catch(error => {
      console.error(error.stack);
    });
  },10000)
})

app.use(require('express-static')('./'));

app.listen(3000,()=>{
  console.log('up and running on localhost:3000')
});