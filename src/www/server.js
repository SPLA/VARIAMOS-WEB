const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 4000;
const cors = require('cors');
//Importar base de datos
const mongoose = require('mongoose');
const config = require('./DB.js');

//rutas de consulta express
const postRoute = require('./post.route');
const adaptationRoute = require('./adaptation.route');
const applicationRoute = require('./application.route');
const domainRoute = require('./domain.route');

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/posts', postRoute);
app.use('/adaptations', adaptationRoute);
app.use('/applications', applicationRoute);
app.use('/domains', domainRoute);

app.listen(PORT, function(){
  console.log('Server is running on Port:',PORT);
});