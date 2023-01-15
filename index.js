const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const authRoute = require('./routes/auth.js');
const postsRoute = require('./routes/posts.js');

mongoose.connect(process.env.DB_CONNECT, () => {
  console.log('terkoneksi ke mongodb')
});

const app = express();

app.use(express.json());
app.use('/api/user/', authRoute);
app.use('/api/posts', postsRoute);

const host = 'localhost';
const port = 3000;
app.listen(port, host, () => {
  console.log(`server berjalan di host: ${host} port: ${port}`)
});