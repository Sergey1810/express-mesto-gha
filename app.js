const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const errorMiddlewares = require('./middlewares/errors')

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() =>{
  console.log('db connected')
}

);

app.use(bodyParser.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '6488c0039d09d41de576af34'
//   };

//   next();
// }); 

app.use(routes);

app.use(errorMiddlewares)
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
}) 