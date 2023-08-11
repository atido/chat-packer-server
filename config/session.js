const session = require('express-session');

const MongoStore = require('connect-mongo');

module.exports = app => {
  app.set('trust proxy', 1);

  app.use(
    session({
      secret: process.env.JWT_TOKEN_SECRET,
      resave: true,
      saveUninitialized: false,
      /*cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: Number(process.env.COOKIE_MAX_AGE) || 60000,
      },*/
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chat-packer',
      }),
    })
  );
};
