const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const dbURI = process.env.REACT_APP_DB_URI || require('./config').dbURI;


const app = express();
const port = process.env.PORT || 5000;

app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );
    if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE');
    return res.status(200).json({});
    }
    return next();
});

mongoose.connect(dbURI,{useNewUrlParser:true})
    .then(() =>console.log('MongoDB connected'))
    .catch(err => console.log('failed to connect DB',err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger('dev'));
app.use('/users',userRoute);
app.use('/posts',postRoute);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
    app.get('*', (req, res) => {
      res.sendFile(
        path.resolve(__dirname, '..', 'client', 'build', 'index.html')
      );
    });
  }

app.listen(port, () => {
console.log(`Server running at port ${port}`);
});
  