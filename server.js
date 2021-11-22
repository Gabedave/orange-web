'use strict';
import 'dotenv/config';
import express from 'express';
// const bodyParser  = require('body-parser');
import cors from 'cors';
import defaultExport from './routes/api.js';
import helmet from 'helmet';
import mongoose from 'mongoose';
import serverless from 'serverless-http';

const apiRoutes = defaultExport;
const app = express();
app.set("view engine","pug")
app.set("views", process.cwd() + '/views')

app.use('/public', express.static(process.cwd() + '/public'));
app.disable('x-powered-by');

app.use(cors({origin: "'self'"}))

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Helmetjs Security
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: "'self'",
//     scriptSrc: ["'self'","'unsafe-inline'","*.jquery.com"],
//     styleSrc: ["'self'"]
//   }
// }))
app.use(helmet.hsts({
  preload: true
}))
app.use(helmet.referrerPolicy({
  policy: ["origin", "unsafe-url"]
}))
//Mongoose connection
mongoose.connect(process.env.DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const Schema = mongoose.Schema
const mediaSchema = new Schema({
  mediaId: {type:String,required:true},
  url: {type:String,required:true}
}, {versionKey: false})

const Media = mongoose.model('media',mediaSchema)

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.render('index');
  });

//Routing for API 
apiRoutes(app,Media);
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const handler = serverless(app);

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  // if(process.env.NODE_ENV==='test') {
  //   console.log('Running Tests...');
  //   setTimeout(function () {
  //     try {
  //       runner.run();
  //     } catch(e) {
  //       console.log('Tests are not valid:');
  //       console.error(e);
  //     }
  //   }, 3500);
  // }
});
