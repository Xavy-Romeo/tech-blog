const express = require('express');
// const controllers = require('./controllers');
const app = express();
const PORT = process.env.PORT || 3333;

const sequelize = require('./config/connection');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(require('./controllers/'));

sequelize.sync({force: true})
.then(() => {
    app.listen(PORT, () => console.log(`Now listening on Port ${PORT}!`));
});