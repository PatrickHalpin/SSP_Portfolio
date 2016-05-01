var express = require('express');
var router = express.Router();
var fs = require("fs");

//create array to hold files to be uploaded
var files = new Array();


// populate files array with files already in the folder
// fs.readdir('./uploads/', function (err, files) { if (err) throw err;
//   files.forEach( function (file) {
//     files.push(file);
//   });
//   console.log(files);
// });

// Home
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome' });
});

//display the index page when index req is sent
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Welcome' });
});

// work
router.get('/work', function(req, res, next) {
//     fs.readdir('./uploads/', function (err, files) { if (err) throw err;
//     files.forEach( function (file)
//     {
//     files.push(file);
//     res.render('work', {workFiles: files});

//     });
// });
    res.render('work', {workFiles: files,title: 'Work'});
});

//login + admin
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

router.post('/login', function (req, res, next) 
{
    //ensures password and username are correct
    if (req.body.yourPassword == "password" && req.body.yourName == "user")
  {
    //loads specififed page
    res.render('admin', {yourName: req.body.yourName, pwd: req.body.yourPassword,theFiles: files});
  }

}); 

//uplodad files
router.post('/uploadFile', function(req,res,next) {

    req.files[0]._id = Date.now();
    req.files[0].newTitle= req.body.newTitle;
    req.files[0].desc= req.body.desc;

    //add uploaded file to array
    files.push(req.files[0])
    //send user to files which redirects them to the uploaed files
    res.redirect('/login');
});

//sends user to uploaded file [age which displays all uploaded files
router.get('/files', function (req, res, next) {
    res.render('login', {theFiles: files,title: 'Admin'});
});

//deletes uploaded files
router.get('/deleteFile/:fileID', function(req,res,next){
    for(var i=0; i < files.length; i ++)
    {
        //check if file matches selected id
        if(files[i]._id==req.params.fileID)
        {
            //deletes file
            fs.unlink('./uploads/' + files[i].filename, function(error){
            });
            //remove from array list
            files.splice(i,1);
            break;  
        }
    }
    //reloads page with files now missing 
    res.redirect('/files');
});

//edits uploaded
router.get('/edit/:fileID', function(req,res,next){
    for(var i=0; i < files.length; i ++)
    {
        if(files[i]._id==req.params.fileID)
        {
            //changes object properties
            files[i].newTitle=req.body.editTitle;
            files[i].desc=req.body.editDesc;
        }
    }
    //reloads page with edited files 
    res.redirect('/files');
});



module.exports = router;
