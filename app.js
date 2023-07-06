const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const errorMiddlewares = require('./middlewares/errors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('db connected');
});

app.use(bodyParser.json());

app.use(routes);

app.use(errorMiddlewares);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
