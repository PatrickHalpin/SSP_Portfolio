//app requirements
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();
var multer = require('multer');
var fs = require('fs');

//Function for storing files in the uploads folder
var storageMethod = multer.diskStorage({
    destination: function (req, file, cb) {
      //check if uploads exitsts
        fs.exists('./uploads', function(exists){
          if (!exists){
            //cretates folder if it dosnt
            fs.mkdir('./uploads', function(error) {
              cb(error, './uploads');
            })
         } 
          else {
            cb(null, './uploads/');} 

        })  
    },
    filename: function (req, file, cb) {
        //saves the file with the current date added on
        cb(null, Date.now() + '_' + file.originalname);
    }
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));

//uses multer for saving files
app.use('/',multer({storage: storageMethod}).any());

app.use('/', routes);

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

