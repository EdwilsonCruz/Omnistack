const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// basicamente, vai fazer o backend ser acessivel pelo
// frontend, mesmo estando em dominios diferentes.
const cors = require('cors');


const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


// conexao cloud mongodb
mongoose.connect('mongodb+srv://userAdmin:$edwilson2018@clusterreact0-dnd94.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.io = io;

  next();
});

app.use(cors());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));
app.use(require('./routes'));

server.listen(2018);
