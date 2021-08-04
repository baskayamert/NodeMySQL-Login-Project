const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
const db = require('./models');

// Passport config
require('./config/passport')(passport);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  app.listen(PORT, console.log(`Server started on port ${PORT}`));
});
