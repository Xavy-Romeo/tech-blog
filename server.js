const express = require('express');

const app = express();
const PORT = process.env.PORT || 3333;

const sequelize = require('./config/connection');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

sequelize.sync({force: false})
.then(() => {
    app.listen(PORT, () => console.log(`Now listening on Port ${PORT}!`));
});