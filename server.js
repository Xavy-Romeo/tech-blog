// require dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');

// require controllers
const controllers = require('./controllers');

// instantiate the server
const app = express();
// creating a port for the server
const PORT = process.env.PORT || 3333;

// sequelize connection
const sequelize = require('./config/connection');
// setup store
const SequelizeStore = require('connect-session-sequelize')(session.Store)

// session object
const sess = {
    secret: 'Super super secret xxx**!!**xxx',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

// express-session middleware
app.use(session(sess));

const helpers = require('./utils/helpers');

const hbs = exphbs.create({helpers});

// handlebars template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// express middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// use controllers
app.use(controllers);

// sync sequelize tables if true, then start server connection
sequelize.sync({force: false})
.then(() => {
    app.listen(PORT, () => console.log(`Now listening on Port ${PORT}!`));
});