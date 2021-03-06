const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const serverRouter = require('./routes/serverRoutes');
const groupRouter = require('./routes/groupRoutes');
const userGroupRouter = require('./routes/userGroupRoutes');
const dmetaRouter = require('./routes/dmetaRoutes');
const viewRouter = require('./routes/viewRoutes');
const accessTokens = require('./controllers/accessTokenController');
const miscRouter = require('./routes/miscRoutes');

const app = express();

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views'); // set basedir for pug

// Save changeLogVersion as a global pug variable:
try {
  const doc = fs.readFileSync(path.join(__dirname, 'NEWS'), 'utf8');
  const fLine = doc.split('\n')[0];
  const fblocks = fLine.split(' ');
  const version = fblocks[fblocks.length - 1];
  app.locals.changeLogVersion = version;
} catch {
  console.log('changeLogVersion not found in NEWS file.');
}

// 1) GLOBAL MIDDLEWARES
app.use(cors());
app.options('*', cors());
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet());

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ['*'],
//       // childSrc: ['blob:'],
//       // scriptSrc: ['*'],
//       // styleSrc: ["'self'"],
//       // imgSrc: ["'self'"],
//       // connectSrc: ["'self'"],
//       // fontSrc: ["'self'"],
//       // objectSrc: ["'none'"],
//       // mediaSrc: ["'self'"],
//       frameSrc: ["'*'"]
//     }
//   })
// );

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
// Passport configuration
require('./utils/auth');

app.use(
  expressSession({
    saveUninitialized: true,
    resave: true,
    secret: process.env.SESSION_SECRET
  })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization agains XSS
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(compression());

// Clean up expired tokens in the database
setInterval(() => {
  accessTokens.removeExpired(function(err) {
    if (err) {
      console.log('Error removing expired tokens');
    }
  });
}, process.env.TIME_TO_CHECK_EXPIRED_TOKENS * 1000);

// 2) ROUTES
app.use('/api/v1/dmeta', dmetaRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/server', serverRouter);
app.use('/api/v1/usergroups', userGroupRouter);
app.use('/api/v1/misc', miscRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
