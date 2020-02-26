require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');

mongoose.connect('mongodb://localhost/Assignment',{useNewUrlParser : true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Connected to DB');
    });

const app = express();

app.use(express.json());
app.use('/api/users/',users);



app.listen(3000 ,()=>{
    console.log(`Listening on 3000`);
});

